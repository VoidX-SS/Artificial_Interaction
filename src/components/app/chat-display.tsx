
"use client";

import { MessageSquare, Loader2, Clock, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/app/chat-message';
import type { Message } from '@/app/page';
import type { I18n } from '@/lib/i18n';
import { useEffect, useRef } from 'react';

interface ChatDisplayProps {
  chatLog: Message[];
  isGenerating: boolean;
  messageCount: number;
  elapsedTime: number;
  agent1Name: string;
  agent2Name: string;
  t: I18n;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

export function ChatDisplay({ chatLog, isGenerating, messageCount, elapsedTime, agent1Name, agent2Name, t }: ChatDisplayProps) {
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [chatLog, isGenerating]);
  
  return (
    <div className="flex h-screen flex-col bg-background">
       <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <h1 className="text-lg font-semibold">{t.conversation}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
                <Bot className="h-4 w-4" />
                <span>{messageCount} {t.messages}</span>
            </div>
            <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(elapsedTime)}</span>
            </div>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" viewportRef={scrollViewportRef}>
          <div className="p-4 md:p-6">
            {chatLog.length === 0 ? (
              <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12" />
                  <p className="mt-4 text-lg">{t.conversationAppearHere}</p>
                  <p className="mt-1 text-sm">
                    {t.pressStart}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {chatLog.map((msg, index) => (
                  <ChatMessage 
                    key={index} 
                    agent={msg.agent} 
                    text={msg.text} 
                    isAgent1={msg.agent === agent1Name}
                  />
                ))}
                 {isGenerating && (
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                        <div className="w-full text-muted-foreground">{t.typing}...</div>
                    </div>
                 )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
