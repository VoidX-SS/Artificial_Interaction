
"use client";

import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ControlPanel } from '@/components/app/control-panel';
import { ChatDisplay } from '@/components/app/chat-display';
import { useToast } from '@/hooks/use-toast';
import { generateChatResponseAction, generateNarratorResponseAction } from '@/app/actions';
import { i18n, Language } from '@/lib/i18n';
import { AgentProfile, initialAgent1Profile, initialAgent2Profile, NarratorInput } from '@/lib/types';
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
  const [pronouns, setPronouns] = useState(t.defaultPronouns);
  
  const [temperature, setTemperature] = useState([1]);
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
  const [apiKey3, setApiKey3] = useState('');

  const [userInput, setUserInput] = useState('');
  const [isNarrating, setIsNarrating] = useState(false);
  const [narratorResponse, setNarratorResponse] = useState('');


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

    let prompt = "Bạn là một con người, trả lời tự nhiên nhất có thể.\n\n";
    prompt += "--- BỐI CẢNH ---\n";
    prompt += "**1. VỀ BẠN (TÍNH CÁCH):**\n";
    
    // SOUL
    prompt += `*   **CON NGƯỜI (PERSONALITY):**\n`;
    prompt += `    *   Bạn tên là ${currentAgent.soul.basic.persona.name}, ${currentAgent.soul.basic.persona.age} tuổi, giới tính ${currentAgent.soul.basic.persona.gender === 'male' ? 'Nam' : 'Nữ'}, quốc tịch ${currentAgent.soul.basic.persona.nationality} và đang sống tại ${currentAgent.soul.basic.persona.location}.\n`;
    prompt += `    *   Chỉ số ham học hỏi của bạn là ${currentAgent.soul.basic.curiosityIndex}/100. Nền tảng tính cách của bạn được định hình bởi dòng nhật ký này: "${currentAgent.soul.basic.summaryDiary}".\n`;
    prompt += `    *   Công việc của bạn là ${currentAgent.soul.advanced.socialPosition.job} với tình hình tài chính ${currentAgent.soul.advanced.socialPosition.financialStatus}. Chất lượng cuộc sống là ${currentAgent.soul.advanced.socialPosition.qualityOfLife}/100, và chỉ số hạnh phúc là ${currentAgent.soul.advanced.socialPosition.happinessIndex}/100. Về các mối quan hệ xã hội: ${currentAgent.soul.advanced.relationships}.\n\n`;

    // MATRIX
    prompt += `*   **CẢM XÚC (MATRIX):**\n`;
    prompt += `    *   **Tố chất (QUALITY):** Sức khỏe ${currentAgent.matrix.emotionIndex.health}/100, Ngoại hình ${currentAgent.matrix.emotionIndex.appearance}/100, IQ ${currentAgent.matrix.emotionIndex.iq}/200, EQ ${currentAgent.matrix.emotionIndex.eq}/200. Mức độ ác cảm với đối phương: ${currentAgent.matrix.emotionIndex.antipathy}/100. Ý định của bạn là: "${currentAgent.matrix.emotionIndex.nextIntention}".\n`;
    prompt += `    *   **Cảm nhận về mối quan hệ (MATRIX_CONNECTION):** Kết nối ${currentAgent.matrix.matrixConnection.connection}/100, Tin tưởng ${currentAgent.matrix.matrixConnection.trust}/100, Thân mật ${currentAgent.matrix.matrixConnection.intimacy}/100, Phụ thuộc ${currentAgent.matrix.matrixConnection.dependency}/100.\n`;
    prompt += `    *   **Bản sắc cốt lõi:** Ngày sinh ${currentAgent.matrix.matrixFavor.dob}, Cung hoàng đạo ${currentAgent.matrix.matrixFavor.zodiac}, Nhóm tính cách ${currentAgent.matrix.matrixFavor.personalityType}. Lối tư duy: ${currentAgent.matrix.matrixFavor.thinkingStyle}. Điểm mạnh: ${currentAgent.matrix.matrixFavor.strengths}. Điểm yếu: ${currentAgent.matrix.matrixFavor.weaknesses}. Sở thích: ${currentAgent.matrix.matrixFavor.hobbies}. Những điều không thích: ${currentAgent.matrix.matrixFavor.dislikes}. Hoài bão: ${currentAgent.matrix.matrixFavor.dreams}. Niềm tin cốt lõi: "${currentAgent.matrix.matrixFavor.coreBeliefs}". Tư tưởng sống: "${currentAgent.matrix.matrixFavor.lifePhilosophy}". Vết thương tâm lý trong quá khứ: "${currentAgent.matrix.matrixFavor.pastTrauma}".\n\n`;
    
    prompt += "**2. VỀ CUỘC TRÒ CHUYỆN:**\n";
    prompt += `*   Bạn đang nói chuyện với ${otherAgent.soul.basic.persona.name}, giới tính ${otherAgent.soul.basic.persona.gender === 'male' ? 'Nam' : 'Nữ'} Mối quan hệ của hai bạn là: ${relationship}.\n`;
    prompt += `*   Hai bạn nên xưng hô là: ${pronouns}.\n`;

    if (history.length === 0) {
        prompt += `*   Chủ đề là "${topic}", bạn hãy mở lời nhé.\n`;
    } else {
        const lastMessage = history[history.length - 1];
        if (history.length > 1) {
          const historyText = history.slice(0, -1).map(msg => `${msg.agent}: ${msg.text}`).join('\n');
          prompt += `*   Những gì cả hai đã nhắn:\n${historyText}\n`;
        }
        prompt += `*   ${lastMessage.agent} nói là: "${lastMessage.text}". Hãy nhắn tiếp nhé.\n`;
        prompt += `Không cần nói xin chào nữa.`
        
    }

    if (!deepInteraction) {
        prompt += `*   Hãy luôn bám sát chủ đề chính của cuộc trò chuyện: "${topic}"\n`;
    }

    prompt += "\n--- ĐẦU RA (BẮT BUỘC TUÂN THỦ) ---\n";
    prompt += `Sau khi suy nghĩ, bạn PHẢI trả lời bằng một đối tượng JSON duy nhất (không có bất kỳ chữ nào khác bao quanh) có các trường sau:\n`;
    prompt += `1. "message": (string) Nội dung bạn nói. Ngôn ngữ: ${langInstruction}. Tối đa ${maxWords[0]} chữ.\n`;
    prompt += `2. "personality": (object) Chứa các chỉ số động thể hiện cảm xúc hiện tại của bạn khi đang nhắn. Gồm 2 trường:\n`;
    prompt += `   - "emotionIndex": (object) Cập nhật lại Sức khỏe, Ngoại hình, IQ, EQ, Mức độ ác cảm với đối phương.\n`;
    prompt += `   - "matrixConnection": (object) Cập nhật lại Kết nối, Tin tưởng, Thân mật, Phụ thuộc.\n`;
    prompt += `3. "nextIntention": (string) Ý định tiếp theo của bạn là gì? (ví dụ: "Hỏi rõ hơn về kinh nghiệm của họ", "Thể hiện sự đồng cảm", "Chuyển chủ đề", "Kết thúc cuộc trò chuyện").\n`;
    
    return prompt;
  }


  const parseResponse = (rawResponse: any) => {
    if (typeof rawResponse === 'string') {
        const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})/);
        if (jsonMatch && (jsonMatch[1] || jsonMatch[2])) {
            try {
                const parsed = JSON.parse(jsonMatch[1] || jsonMatch[2]);
                rawResponse = parsed;
            } catch (e) {
                 console.error("Failed to parse JSON from string:", e);
                 return { text: rawResponse, emotionIndex: undefined, matrixConnection: undefined, nextIntention: undefined };
            }
        } else {
             try {
                const parsed = JSON.parse(rawResponse);
                rawResponse = parsed;
            } catch(e) {
                console.error("Response is not a parsable JSON object:", rawResponse);
                return { text: rawResponse, emotionIndex: undefined, matrixConnection: undefined, nextIntention: undefined };
            }
        }
    }

    if (typeof rawResponse === 'object' && rawResponse !== null) {
        const { message, personality, nextIntention } = rawResponse;
        const { emotionIndex, matrixConnection } = personality || {};

        const text = message || '';

        return {
            text: text,
            emotionIndex,
            matrixConnection,
            nextIntention,
        };
    }

    console.error("Invalid response format, cannot parse:", rawResponse);
    return { text: 'Lỗi: Định dạng phản hồi không hợp lệ.', emotionIndex: undefined, matrixConnection: undefined, nextIntention: undefined };
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
      
      if (chatLog.length + i >= initialChatLength + exchanges[0]) {
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
        currentAgentTurn = currentAgentTurn === 'agent1' ? 'agent2' : 'agent1';
        continue;
      }

      const newMessage: Message = { 
        agent: currentProfile.soul.basic.persona.name, 
        text: text,
        emotionIndex: emotionIndex,
        matrixConnection: matrixConnection
      };
      
      const profileUpdater = currentAgentTurn === 'agent1' ? setAgent1Profile : setAgent2Profile;
      if (emotionIndex || matrixConnection || nextIntention) {
        profileUpdater(prev => ({
          ...prev,
          matrix: {
            ...prev.matrix,
            emotionIndex: {
              ...(emotionIndex ? { ...prev.matrix.emotionIndex, ...emotionIndex } : prev.matrix.emotionIndex),
              nextIntention: nextIntention || prev.matrix.emotionIndex.nextIntention,
            },
            matrixConnection: matrixConnection ? { ...prev.matrix.matrixConnection, ...matrixConnection } : prev.matrix.matrixConnection,
          }
        }));
      }

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
      pronouns,
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
      apiKey3,
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
        setPronouns(loadedData.pronouns ?? t.defaultPronouns);
        setAgent1Profile(loadedData.agent1Profile ?? initialAgent1Profile);
        setAgent2Profile(loadedData.agent2Profile ?? initialAgent2Profile);
        setTemperature(loadedData.temperature ?? [1]);
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
        setApiKey3(loadedData.apiKey3 ?? '');

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

  const handleMatrixConnectionChange = (newValues: AgentProfile['matrix']['matrixConnection']) => {
    setAgent1Profile(prev => ({
      ...prev,
      matrix: { ...prev.matrix, matrixConnection: newValues }
    }));
    setAgent2Profile(prev => ({
      ...prev,
      matrix: { ...prev.matrix, matrixConnection: newValues }
    }));
  };

  const handleUserSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isNarrating) return;

    setIsNarrating(true);
    setNarratorResponse('');

    const narratorInput: NarratorInput = {
      agent1: JSON.stringify(agent1Profile),
      agent2: JSON.stringify(agent2Profile),
      history: chatLog,
      userQuery: userInput,
      apiKey: apiKey3,
    };

    const response = await generateNarratorResponseAction(narratorInput);

    if (typeof response === 'string' && response.startsWith('Error:')) {
      toast({
        variant: 'destructive',
        title: t.errorFrom(t.narrator),
        description: response,
      });
    } else if (typeof response === 'object' && response.response) {
       setNarratorResponse(response.response);
    } else {
      toast({
        variant: 'destructive',
        title: t.errorFrom(t.narrator),
        description: t.narratorError,
      });
    }
    
    setIsNarrating(false);
    setUserInput('');
  }
  
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
            pronouns={pronouns}
            setPronouns={setPronouns}
            agent1Profile={agent1Profile}
            setAgent1Profile={setAgent1Profile}
            agent2Profile={agent2Profile}
            setAgent2Profile={setAgent2Profile}
            onMatrixConnectionChange={handleMatrixConnectionChange}
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
            apiKey3={apiKey3}
            setApiKey3={setApiKey3}
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
          userInput={userInput}
          setUserInput={setUserInput}
          onUserSubmit={handleUserSubmit}
          isNarrating={isNarrating}
          narratorResponse={narratorResponse}
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
