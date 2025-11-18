
"use client";

import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { ControlPanel } from '@/components/app/control-panel';
import { ChatDisplay } from '@/components/app/chat-display';
import { useToast } from '@/hooks/use-toast';
import { generatePersonalityAction, generateChatResponseAction } from '@/app/actions';
import { i18n, Language } from '@/lib/i18n';
import { AgentProfile, initialAgent1Profile, initialAgent2Profile } from '@/lib/types';
import { LiveDashboard } from '@/components/app/live-dashboard';

export interface Message {
  agent: string;
  text: string;
  emotionIndex?: AgentProfile['matrix']['emotionIndex'];
  matrixConnection?: AgentProfile['matrix']['matrixConnection'];
}

export type Theme = 'light' | 'dark' | 'system';

const AVG_READING_SPEED_SECONDS_PER_WORD = 0.4;

export default function Home() {
  const [language, setLanguage] = useState<Language>('vi');
  const t = i18n[language];
  const { toast } = useToast();
  
  const [agent1Profile, setAgent1Profile] = useState<AgentProfile>(initialAgent1Profile);
  const [agent2Profile, setAgent2Profile] = useState<AgentProfile>(initialAgent2Profile);

  const [topic, setTopic] = useState(t.defaultTopic);
  
  const [temperature, setTemperature] = useState([0.7]);
  const [maxWords, setMaxWords] = useState([250]);
  const [exchanges, setExchanges] = useState([5]);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [theme, setTheme] = useState<Theme>('light');
  const [leisurelyChat, setLeisurelyChat] = useState(true);
  const [apiKey, setApiKey] = useState('');


  const isRunningRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (isGenerating) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isGenerating]);

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.className = e.matches ? 'dark' : 'light';
      };
      document.documentElement.className = mediaQuery.matches ? 'dark' : 'light';
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.documentElement.className = theme;
    }
  }, [theme]);

  const handleGeneratePersonality = async (agentNum: 1 | 2) => {
    const profile = agentNum === 1 ? agent1Profile : agent2Profile;
    const description = profile.soul.basic.summaryDiary; // Using summary diary as the basis for generation

    if (!description.trim()) {
      toast({
        variant: 'destructive',
        title: t.error,
        description: t.providePersonalityDesc(agentNum),
      });
      return;
    }

    const setter = agentNum === 1 ? setAgent1Profile : setAgent2Profile;
    const generatedPersonality = await generatePersonalityAction(description, language, apiKey);
    
    if(generatedPersonality.startsWith('Error:')) {
      toast({
        variant: 'destructive',
        title: t.personalityGenerationFailed,
        description: generatedPersonality,
      });
    } else {
      setter(prev => ({
        ...prev,
        soul: {
          ...prev.soul,
          basic: {
            ...prev.soul.basic,
            summaryDiary: generatedPersonality
          }
        }
      }));
      toast({
        title: t.personalityGenerated,
        description: t.personalityUpdated(agentNum),
      });
    }
  };

  const constructPrompt = (currentAgentProfile: AgentProfile, otherAgentProfile: AgentProfile, history: Message[]) => {
    const langInstruction = language === 'vi' ? 'The conversation must be in Vietnamese.' : 'The conversation must be in English.';
    
    const profileString = JSON.stringify({ soul: currentAgentProfile.soul, matrix: currentAgentProfile.matrix }, null, 2);
    const otherProfileString = JSON.stringify({ soul: { basic: { persona: otherAgentProfile.soul.basic.persona } } }, null, 2);

    let prompt = `You are an AI character. Your entire persona and current state are defined by the following JSON object. Adhere to it strictly.\n\n`;
    prompt += `YOUR PROFILE:\n${profileString}\n\n`;
    prompt += `You are in a conversation with another agent. Here is their basic persona:\n${otherProfileString}\n\n`;
    prompt += `LANGUAGE GUIDELINE: ${langInstruction}\n`;
    prompt += `RESPONSE WORD LIMIT: Your response must be a maximum of ${maxWords[0]} words.\n\n`;
    prompt += `CONVERSATION TOPIC: ${topic}\n\n`;
    prompt += 'CONVERSATION HISTORY (read from top to bottom):\n';
    if (history.length === 0) {
      prompt += 'This is the beginning of the conversation. Please start.\n';
    } else {
      history.forEach(msg => {
        prompt += `${msg.agent}: ${msg.text}\n`;
      });
    }
    prompt += `\nINSTRUCTIONS: Now, as ${currentAgentProfile.soul.basic.persona.name}, provide your next response. After your text response, you MUST provide an updated JSON object of your OWN dynamic matrices ('emotionIndex' and 'matrixConnection') based on the current conversation context. The JSON object must be enclosed in triple backticks (\`\`\`).\n`;
    prompt += `${currentAgentProfile.soul.basic.persona.name}:`;

    return prompt;
  };

  const parseResponse = (responseText: string) => {
    const textMatch = responseText.split('```json')[0].trim();
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
  
    if (jsonMatch && jsonMatch[1]) {
      try {
        const matrixData = JSON.parse(jsonMatch[1]);
        return {
          text: textMatch,
          emotionIndex: matrixData.emotionIndex,
          matrixConnection: matrixData.matrixConnection,
        };
      } catch (e) {
        console.error("Failed to parse matrix JSON from AI response:", e);
        return { text: textMatch, emotionIndex: undefined, matrixConnection: undefined };
      }
    }
    return { text: responseText, emotionIndex: undefined, matrixConnection: undefined };
  };

  const handleStart = async () => {
    if (!topic.trim()) {
      toast({
        variant: 'destructive',
        title: t.error,
        description: t.provideTopic,
      });
      return;
    }
    
    if (!isGenerating && chatLog.length === 0) {
        setElapsedTime(0);
    }
    setIsGenerating(true);
    isRunningRef.current = true;

    let currentHistory: Message[] = [...chatLog];
    const initialChatLength = chatLog.length;

    let currentAgent: 'agent1' | 'agent2' = 'agent1';
    if (currentHistory.length > 0) {
      const lastSpeakerName = currentHistory[currentHistory.length - 1].agent;
      currentAgent = lastSpeakerName === agent1Profile.soul.basic.persona.name ? 'agent2' : 'agent1';
    }


    for (let i = 0; i < exchanges[0] * 2; i++) {
      if (!isRunningRef.current) {
        toast({ title: t.conversationStopped, description: t.conversationStoppedManually });
        break;
      }
      
      if (currentHistory.length >= initialChatLength + exchanges[0] * 2) {
        break;
      }

      if (leisurelyChat && currentHistory.length > 0) {
        const lastMessage = currentHistory[currentHistory.length - 1];
        const wordCount = lastMessage.text.split(/\s+/).length;
        const delay = wordCount * AVG_READING_SPEED_SECONDS_PER_WORD * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      if (!isRunningRef.current) {
        break;
      }

      const currentProfile = currentAgent === 'agent1' ? agent1Profile : agent2Profile;
      const otherProfile = currentAgent === 'agent1' ? agent2Profile : agent1Profile;

      const prompt = constructPrompt(currentProfile, otherProfile, currentHistory);
      const rawResponse = await generateChatResponseAction(prompt, apiKey);

      if (rawResponse.startsWith('Error:')) {
        toast({
          variant: 'destructive',
          title: t.errorFrom(currentProfile.soul.basic.persona.name),
          description: rawResponse,
        });
        setIsGenerating(false);
        isRunningRef.current = false;
        return; 
      }
      
      const { text, emotionIndex, matrixConnection } = parseResponse(rawResponse);

      const newMessage: Message = { 
        agent: currentProfile.soul.basic.persona.name, 
        text: text,
        emotionIndex: emotionIndex,
        matrixConnection: matrixConnection
      };
      currentHistory = [...currentHistory, newMessage];
      setChatLog(prev => [...prev, newMessage]);

      // Update the agent's matrix based on the response
      const profileUpdater = currentAgent === 'agent1' ? setAgent1Profile : setAgent2Profile;
      if (emotionIndex || matrixConnection) {
        profileUpdater(prev => ({
          ...prev,
          matrix: {
            ...prev.matrix,
            emotionIndex: emotionIndex || prev.matrix.emotionIndex,
            matrixConnection: matrixConnection || prev.matrix.matrixConnection,
          }
        }));
      }

      currentAgent = currentAgent === 'agent1' ? 'agent2' : 'agent1';
    }

    setIsGenerating(false);
    isRunningRef.current = false;
  };

  const handleStop = () => {
    if (isGenerating) {
      isRunningRef.current = false;
      setIsStopping(true);
      setTimeout(() => {
        setIsGenerating(false);
        setIsStopping(false);
      }, 500);
    }
  };

  const handleReset = () => {
    handleStop();
    setChatLog([]);
    setElapsedTime(0);
    setAgent1Profile(initialAgent1Profile);
    setAgent2Profile(initialAgent2Profile);
    toast({ title: t.conversationReset, description: t.chatCleared });
  };

  const handleSave = () => {
    const sessionData = {
      topic,
      agent1Profile,
      agent2Profile,
      temperature,
      maxWords,
      exchanges,
      chatLog,
      language,
      elapsedTime,
      theme,
      leisurelyChat,
    };
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dualogue-session-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: t.sessionSaved, description: t.sessionSavedDesc });
  };
  
  const handleSaveProfiles = () => {
    const profiles = { agent1Profile, agent2Profile };
    const blob = new Blob([JSON.stringify(profiles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dualogue-profiles-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: t.profilesSaved, description: t.profilesSavedDesc });
  };


  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleLoadProfilesClick = () => {
    profileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          throw new Error('File could not be read');
        }
        const loadedData = JSON.parse(result);
        
        setTopic(loadedData.topic ?? t.defaultTopic);
        setAgent1Profile(loadedData.agent1Profile ?? initialAgent1Profile);
        setAgent2Profile(loadedData.agent2Profile ?? initialAgent2Profile);
        setTemperature(loadedData.temperature ?? [0.7]);
        setMaxWords(loadedData.maxWords ?? [250]);
        setExchanges(loadedData.exchanges ?? [5]);
        setChatLog(loadedData.chatLog ?? []);
        setLanguage(loadedData.language ?? 'vi');
        setElapsedTime(loadedData.elapsedTime ?? 0);
        setTheme(loadedData.theme ?? 'light');
        setLeisurelyChat(loadedData.leisurelyChat === undefined ? true : loadedData.leisurelyChat);

        toast({ title: t.sessionLoaded, description: t.sessionLoadedDesc });
      } catch (error) {
        toast({ variant: 'destructive', title: t.loadFailed, description: t.loadFailedDesc});
      }
    };
    reader.readAsText(file);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleProfileFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          throw new Error('File could not be read');
        }
        const loadedProfiles = JSON.parse(result);
        
        if (loadedProfiles.agent1Profile && loadedProfiles.agent2Profile) {
          setAgent1Profile(loadedProfiles.agent1Profile);
          setAgent2Profile(loadedProfiles.agent2Profile);
          toast({ title: t.profilesLoaded, description: t.profilesLoadedDesc });
        } else {
          throw new Error('Invalid profile file format');
        }

      } catch (error) {
        toast({ variant: 'destructive', title: t.profileLoadFailed, description: t.profileLoadFailedDesc });
      }
    };
    reader.readAsText(file);
    if(profileInputRef.current) {
      profileInputRef.current.value = '';
    }
  };
  
  return (
    <main className="h-screen overflow-hidden bg-background font-sans">
      <div className="grid h-full md:grid-cols-[400px_1fr] lg:grid-cols-[450px_1fr]">
        {isGenerating ? (
          <LiveDashboard
            agent1={agent1Profile}
            agent2={agent2Profile}
            t={t}
          />
        ) : (
          <ControlPanel
            topic={topic}
            setTopic={setTopic}
            agent1Profile={agent1Profile}
            setAgent1Profile={setAgent1Profile}
            agent2Profile={agent2Profile}
            setAgent2Profile={setAgent2Profile}
            temperature={temperature}
            setTemperature={setTemperature}
            maxWords={maxWords}
            setMaxWords={setMaxWords}
            exchanges={exchanges}
            setExchanges={setExchanges}
            isGenerating={isGenerating}
            isStopping={isStopping}
            onStart={handleStart}
            onStop={handleStop}
            onReset={handleReset}
            onGeneratePersonality={handleGeneratePersonality}
            onSave={handleSave}
            onLoad={handleLoadClick}
            onSaveProfiles={handleSaveProfiles}
            onLoadProfiles={handleLoadProfilesClick}
            language={language}
            setLanguage={setLanguage}
            theme={theme}
            setTheme={setTheme}
            chatLog={chatLog}
            leisurelyChat={leisurelyChat}
            setLeisurelyChat={setLeisurelyChat}
            apiKey={apiKey}
            setApiKey={setApiKey}
            t={t}
          />
        )}
        <ChatDisplay 
          chatLog={chatLog} 
          isGenerating={isGenerating} 
          messageCount={chatLog.length} 
          elapsedTime={elapsedTime}
          agent1Name={agent1Profile.soul.basic.persona.name}
          agent2Name={agent2Profile.soul.basic.persona.name}
          t={t}
        />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/json"
        className="hidden"
      />
      <input
        type="file"
        ref={profileInputRef}
        onChange={handleProfileFileChange}
        accept="application/json"
        className="hidden"
      />
    </main>
  );
}
