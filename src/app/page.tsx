
"use client";

import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { ControlPanel } from '@/components/app/control-panel';
import { ChatDisplay } from '@/components/app/chat-display';
import { useToast } from '@/hooks/use-toast';
import { generateChatResponseAction } from '@/app/actions';
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
  const [relationship, setRelationship] = useState(t.defaultRelationship);
  
  const [temperature, setTemperature] = useState([0.7]);
  const [maxWords, setMaxWords] = useState([250]);
  const [exchanges, setExchanges] = useState([5]);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [theme, setTheme] = useState<Theme>('system');
  const [leisurelyChat, setLeisurelyChat] = useState(true);
  const [deepInteraction, setDeepInteraction] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [apiKey2, setApiKey2] = useState('');


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

  const constructPrompt = (currentAgent: AgentProfile, otherAgent: AgentProfile, history: Message[]) => {
    const langInstruction = language === 'vi' ? 'Cuộc hội thoại PHẢI bằng tiếng Việt.' : 'The conversation must be in English.';

    let prompt = "BỐI CẢNH\n";
    prompt += `Bạn tên là ${currentAgent.soul.basic.persona.name}, ${currentAgent.soul.basic.persona.age} tuổi. `;
    prompt += `Chỉ số hạnh phúc hiện tại của bạn là ${currentAgent.soul.advanced.socialPosition.happinessIndex}, IQ của bạn là ${currentAgent.matrix.emotionIndex.iq}. `;
    prompt += `Bạn đang nói chuyện với ${otherAgent.soul.basic.persona.name}, mối quan hệ của hai bạn là: ${relationship}.\n\n`;

    if (history.length === 0) {
        prompt += `Chủ đề là ${topic}, bạn hãy nói trước.\n`;
    } else {
        const lastMessage = history[history.length - 1];
        prompt += `Tin nhắn bạn ấy nói là: "${lastMessage.text}", hãy phát triển hội thoại bằng cách phản hồi tiếp.\n`;
        const historyText = history.map(msg => `${msg.agent}: ${msg.text}`).join('\n');
        prompt += `Những gì cả hai đã trao đổi là:\n${historyText}\n`;
    }

    if (!deepInteraction) {
        prompt += `Chủ đề cả hai đang trao đổi là ${topic}\n`;
    }

    prompt += "\nĐẦU RA\n";
    prompt += `Là một output dạng json có message (nội dung bạn nói), personality (các chỉ số matrix của bạn đã được cập nhật), và nextIntention (ý định tiếp theo của bạn).\n`;
    prompt += `Ngôn ngữ: ${langInstruction}\n`;
    prompt += `Tối đa ${maxWords[0]} chữ cho phần message.\n`;
    
    return prompt;
  }

  const parseResponse = (rawResponse: any) => {
      if (typeof rawResponse === 'string') {
        // This is an error string
        return { text: rawResponse, emotionIndex: undefined, matrixConnection: undefined, nextIntention: undefined };
      }
      if (typeof rawResponse === 'object' && rawResponse !== null) {
        const { message, personality, nextIntention } = rawResponse;
        const { emotionIndex, matrixConnection } = personality || {};
        return {
            text: message || '',
            emotionIndex,
            matrixConnection,
            nextIntention,
        };
      }
      // Fallback for unexpected format
      return { text: 'Error: Invalid response format.', emotionIndex: undefined, matrixConnection: undefined, nextIntention: undefined };
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

    // Agent 1 always starts if history is empty, otherwise determine from last speaker
    let currentAgentTurn: 'agent1' | 'agent2' = 'agent1';
     if (currentHistory.length > 0) {
      const lastSpeakerName = currentHistory[currentHistory.length - 1].agent;
      currentAgentTurn = lastSpeakerName === agent1Profile.soul.basic.persona.name ? 'agent2' : 'agent1';
    }

    for (let i = 0; i < exchanges[0]; i++) {
      if (!isRunningRef.current) {
        toast({ title: t.conversationStopped, description: t.conversationStoppedManually });
        break;
      }
      
      if (currentHistory.length >= initialChatLength + exchanges[0]) {
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

      const currentProfile = currentAgentTurn === 'agent1' ? agent1Profile : agent2Profile;
      const otherProfile = currentAgentTurn === 'agent1' ? agent2Profile : agent1Profile;
      const currentApiKey = currentAgentTurn === 'agent1' ? apiKey : apiKey2;

      const prompt = constructPrompt(currentProfile, otherProfile, currentHistory);
      const rawResponse = await generateChatResponseAction(prompt, currentApiKey);

      if (typeof rawResponse === 'string' && rawResponse.startsWith('Error:')) {
        toast({
          variant: 'destructive',
          title: t.errorFrom(currentProfile.soul.basic.persona.name),
          description: rawResponse,
        });
        setIsGenerating(false);
        isRunningRef.current = false;
        return; 
      }
      
      const { text, emotionIndex, matrixConnection, nextIntention } = parseResponse(rawResponse);
      
      if (!text) {
         toast({
          variant: 'destructive',
          title: t.errorFrom(currentProfile.soul.basic.persona.name),
          description: "AI did not return a message.",
        });
        // continue to next agent maybe? or stop?
        currentAgentTurn = currentAgentTurn === 'agent1' ? 'agent2' : 'agent1';
        continue;
      }

      const newMessage: Message = { 
        agent: currentProfile.soul.basic.persona.name, 
        text: text,
        emotionIndex: emotionIndex,
        matrixConnection: matrixConnection
      };
      
      // Update the agent's matrix based on the response
      const profileUpdater = currentAgentTurn === 'agent1' ? setAgent1Profile : setAgent2Profile;
      if (emotionIndex || matrixConnection || nextIntention) {
        profileUpdater(prev => ({
          ...prev,
          matrix: {
            ...prev.matrix,
            emotionIndex: {
              ...(emotionIndex || prev.matrix.emotionIndex),
              nextIntention: nextIntention || prev.matrix.emotionIndex.nextIntention,
            },
            matrixConnection: matrixConnection || prev.matrix.matrixConnection,
          }
        }));
      }

      // We must wait for the state to update before adding to history to show live intention
      await new Promise(resolve => setTimeout(resolve, 0));

      currentHistory = [...currentHistory, newMessage];
      setChatLog(prev => [...prev, newMessage]);


      currentAgentTurn = currentAgentTurn === 'agent1' ? 'agent2' : 'agent1';
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
      relationship,
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
      deepInteraction,
      apiKey,
      apiKey2,
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
        setRelationship(loadedData.relationship ?? t.defaultRelationship);
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
        setDeepInteraction(loadedData.deepInteraction === undefined ? true : loadedData.deepInteraction);
        setApiKey(loadedData.apiKey ?? '');
        setApiKey2(loadedData.apiKey2 ?? '');

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
            onStop={handleStop}
            isStopping={isStopping}
          />
        ) : (
          <ControlPanel
            topic={topic}
            setTopic={setTopic}
            relationship={relationship}
            setRelationship={setRelationship}
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
            deepInteraction={deepInteraction}
            setDeepInteraction={setDeepInteraction}
            apiKey={apiKey}
            setApiKey={setApiKey}
            apiKey2={apiKey2}
            setApiKey2={setApiKey2}
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
