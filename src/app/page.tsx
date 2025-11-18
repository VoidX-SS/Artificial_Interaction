"use client";

import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { ControlPanel } from '@/components/app/control-panel';
import { ChatDisplay } from '@/components/app/chat-display';
import { useToast } from '@/hooks/use-toast';
import { generatePersonalityAction, generateChatResponseAction } from '@/app/actions';

export interface Message {
  agent: 'Agent 1' | 'Agent 2';
  text: string;
}

export default function Home() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [topic, setTopic] = useState('The future of space exploration and its impact on humanity.');
  const [personality1, setPersonality1] = useState('A pragmatic and cautious scientist who weighs the risks and ethical implications of every decision.');
  const [personality2, setPersonality2] = useState('A visionary artist and dreamer who sees boundless potential and beauty in the cosmos.');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([256]);
  const [exchanges, setExchanges] = useState([5]);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const isRunningRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
        title: 'Error',
        description: `Please provide a description for Agent ${agentNum} personality.`,
      });
      return;
    }
    const setter = agentNum === 1 ? setPersonality1 : setPersonality2;
    const generatedPersonality = await generatePersonalityAction(description);
    if(generatedPersonality.startsWith('Error:')) {
      toast({
        variant: 'destructive',
        title: 'Personality Generation Failed',
        description: generatedPersonality,
      });
    } else {
      setter(generatedPersonality);
      toast({
        title: 'Personality Generated',
        description: `Agent ${agentNum}'s personality has been updated.`,
      });
    }
  };

  const constructPrompt = (currentAgent: 'Agent 1' | 'Agent 2', history: Message[]) => {
    const personality = currentAgent === 'Agent 1' ? personality1 : personality2;
    let prompt = `Your personality is: ${personality}\n\n`;
    prompt += `Conversation Topic: ${topic}\n\n`;
    prompt += 'Conversation History:\n';
    if (history.length === 0) {
      prompt += 'This is the beginning of the conversation. Please start.\n';
    } else {
      history.forEach(msg => {
        prompt += `${msg.agent}: ${msg.text}\n`;
      });
    }
    prompt += `\nNow, as ${currentAgent}, provide the next response.`;
    return prompt;
  };

  const handleStart = async () => {
    if (!topic.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide a conversation topic.',
      });
      return;
    }
    setChatLog([]);
    setElapsedTime(0);
    setIsGenerating(true);
    isRunningRef.current = true;

    let currentHistory: Message[] = [];
    let currentAgent: 'Agent 1' | 'Agent 2' = 'Agent 1';

    for (let i = 0; i < exchanges[0] * 2; i++) {
      if (!isRunningRef.current) {
        toast({ title: 'Conversation Stopped', description: 'The AI conversation has been manually stopped.' });
        break;
      }

      const prompt = constructPrompt(currentAgent, currentHistory);
      const response = await generateChatResponseAction(prompt);

      if (response.startsWith('Error:')) {
        toast({
          variant: 'destructive',
          title: `Error from ${currentAgent}`,
          description: response,
        });
        break; 
      }

      const newMessage: Message = { agent: currentAgent, text: response };
      currentHistory = [...currentHistory, newMessage];
      setChatLog(prev => [...prev, newMessage]);

      currentAgent = currentAgent === 'Agent 1' ? 'Agent 2' : 'Agent 1';
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
    toast({ title: 'Conversation Reset', description: 'The chat has been cleared.' });
  };
  
  return (
    <main className="h-screen overflow-hidden bg-background font-sans">
      <div className="grid h-full md:grid-cols-[400px_1fr] lg:grid-cols-[450px_1fr]">
        <ControlPanel
          apiKey={apiKey}
          setApiKey={handleApiKeyChange}
          topic={topic}
          setTopic={setTopic}
          personality1={personality1}
          setPersonality1={setPersonality1}
          personality2={personality2}
          setPersonality2={setPersonality2}
          temperature={temperature}
          setTemperature={setTemperature}
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          exchanges={exchanges}
          setExchanges={setExchanges}
          isGenerating={isGenerating}
          isStopping={isStopping}
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
          onGeneratePersonality={handleGeneratePersonality}
        />
        <ChatDisplay 
          chatLog={chatLog} 
          isGenerating={isGenerating} 
          messageCount={chatLog.length} 
          elapsedTime={elapsedTime}
        />
      </div>
    </main>
  );
}
