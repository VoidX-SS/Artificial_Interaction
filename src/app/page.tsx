
"use client";

import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { ControlPanel } from '@/components/app/control-panel';
import { ChatDisplay } from '@/components/app/chat-display';
import { useToast } from '@/hooks/use-toast';
import { generatePersonalityAction, generateChatResponseAction } from '@/app/actions';
import { i18n, Language } from '@/lib/i18n';

export interface Message {
  agent: string;
  text: string;
}

export type Theme = 'light' | 'dark' | 'system';

const AVG_READING_SPEED_SECONDS_PER_WORD = 0.4;

export default function Home() {
  const [language, setLanguage] = useState<Language>('vi');
  const t = i18n[language];
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [topic, setTopic] = useState(t.defaultTopic);
  
  const [agent1Name, setAgent1Name] = useState('Agent 1');
  const [agent2Name, setAgent2Name] = useState('Agent 2');

  const [personality1, setPersonality1] = useState(t.defaultPersonality1);
  const [personality2, setPersonality2] = useState(t.defaultPersonality2);
  
  const [temperature, setTemperature] = useState([0.7]);
  const [maxWords, setMaxWords] = useState([250]);
  const [exchanges, setExchanges] = useState([5]);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [theme, setTheme] = useState<Theme>('light');
  const [leisurelyChat, setLeisurelyChat] = useState(true);


  const isRunningRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const savedApiKey = localStorage.getItem('dualogue-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

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


  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem('dualogue-api-key', newApiKey);
  };
  
  const handleGeneratePersonality = async (agentNum: 1 | 2) => {
    const description = agentNum === 1 ? personality1 : personality2;
    if (!description.trim()) {
      toast({
        variant: 'destructive',
        title: t.error,
        description: t.providePersonalityDesc(agentNum),
      });
      return;
    }
    const setter = agentNum === 1 ? setPersonality1 : setPersonality2;
    const generatedPersonality = await generatePersonalityAction(description, language);
    if(generatedPersonality.startsWith('Error:')) {
      toast({
        variant: 'destructive',
        title: t.personalityGenerationFailed,
        description: generatedPersonality,
      });
    } else {
      setter(generatedPersonality);
      toast({
        title: t.personalityGenerated,
        description: t.personalityUpdated(agentNum),
      });
    }
  };

  const constructPrompt = (currentAgentName: string, history: Message[]) => {
    const personality = currentAgentName === agent1Name ? personality1 : personality2;
    const langInstruction = language === 'vi' ? 'The conversation must be in Vietnamese.' : 'The conversation must be in English.';
    let prompt = `Your personality is: ${personality}\n\n`;
    prompt += `${langInstruction}\n`;
    prompt += `Your response must be a maximum of ${maxWords[0]} words.\n\n`;
    prompt += `Conversation Topic: ${topic}\n\n`;
    prompt += 'Conversation History:\n';
    if (history.length === 0) {
      prompt += 'This is the beginning of the conversation. Please start.\n';
    } else {
      history.forEach(msg => {
        prompt += `${msg.agent}: ${msg.text}\n`;
      });
    }
    prompt += `\nNow, as ${currentAgentName}, provide the next response.`;
    return prompt;
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
    
    if (!isGenerating) {
        // Only reset time if starting fresh, not continuing
        if (chatLog.length === 0) {
            setElapsedTime(0);
        }
    }
    setIsGenerating(true);
    isRunningRef.current = true;

    let currentHistory: Message[] = [...chatLog];
    const initialChatLength = chatLog.length;

    let currentAgentName = agent1Name;
    if (currentHistory.length > 0) {
      const lastSpeaker = currentHistory[currentHistory.length - 1].agent;
      currentAgentName = lastSpeaker === agent1Name ? agent2Name : agent1Name;
    }


    for (let i = 0; i < exchanges[0] * 2; i++) {
      if (!isRunningRef.current) {
        toast({ title: t.conversationStopped, description: t.conversationStoppedManually });
        break;
      }
      
      // Check if we have already completed the required exchanges since starting
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
        toast({ title: t.conversationStopped, description: t.conversationStoppedManually });
        break;
      }

      const prompt = constructPrompt(currentAgentName, currentHistory);
      const response = await generateChatResponseAction(prompt);

      if (response.startsWith('Error:')) {
        toast({
          variant: 'destructive',
          title: t.errorFrom(currentAgentName),
          description: response,
        });
        setIsGenerating(false);
        isRunningRef.current = false;
        return; 
      }

      const newMessage: Message = { agent: currentAgentName, text: response };
      currentHistory = [...currentHistory, newMessage];
      setChatLog(prev => [...prev, newMessage]);

      currentAgentName = currentAgentName === agent1Name ? agent2Name : agent1Name;
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
    toast({ title: t.conversationReset, description: t.chatCleared });
  };

  const handleSave = () => {
    const sessionData = {
      topic,
      agent1Name,
      agent2Name,
      personality1,
      personality2,
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

  const handleLoadClick = () => {
    fileInputRef.current?.click();
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
        
        setTopic(loadedData.topic || '');
        setAgent1Name(loadedData.agent1Name || 'Agent 1');
        setAgent2Name(loadedData.agent2Name || 'Agent 2');
        setPersonality1(loadedData.personality1 || '');
        setPersonality2(loadedData.personality2 || '');
        setTemperature(loadedData.temperature || [0.7]);
        setMaxWords(loadedData.maxWords || [250]);
        setExchanges(loadedData.exchanges || [5]);
        setChatLog(loadedData.chatLog || []);
        setLanguage(loadedData.language || 'vi');
        setElapsedTime(loadedData.elapsedTime || 0);
        setTheme(loadedData.theme || 'light');
        setLeisurelyChat(loadedData.leisurelyChat === undefined ? true : loadedData.leisurelyChat);

        toast({ title: t.sessionLoaded, description: t.sessionLoadedDesc });
      } catch (error) {
        toast({ variant: 'destructive', title: t.loadFailed, description: t.loadFailedDesc});
      }
    };
    reader.readAsText(file);
    // Reset file input to allow loading the same file again
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };
  
  return (
    <main className="h-screen overflow-hidden bg-background font-sans">
      <div className="grid h-full md:grid-cols-[400px_1fr] lg:grid-cols-[450px_1fr]">
        <ControlPanel
          apiKey={apiKey}
          setApiKey={handleApiKeyChange}
          topic={topic}
          setTopic={setTopic}
          agent1Name={agent1Name}
          setAgent1Name={setAgent1Name}
          agent2Name={agent2Name}
          setAgent2Name={setAgent2Name}
          personality1={personality1}
          setPersonality1={setPersonality1}
          personality2={personality2}
          setPersonality2={setPersonality2}
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
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
          chatLog={chatLog}
          leisurelyChat={leisurelyChat}
          setLeisurelyChat={setLeisurelyChat}
          t={t}
        />
        <ChatDisplay 
          chatLog={chatLog} 
          isGenerating={isGenerating} 
          messageCount={chatLog.length} 
          elapsedTime={elapsedTime}
          agent1Name={agent1Name}
          agent2Name={agent2Name}
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
    </main>
  );
}
