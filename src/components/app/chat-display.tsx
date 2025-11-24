
"use client";

import { MessageSquare, Loader2, Clock, Bot, Send, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/app/chat-message';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Message } from '@/lib/types';
import type { I18n } from '@/lib/i18n';
import { useEffect, useRef, FormEvent } from 'react';

interface ChatDisplayProps {
  chatLog: Message[];
  isGenerating: boolean;
  isNarrating: boolean;
  elapsedTime: number;
  agent1Name: string;
  agent2Name: string;
  t: I18n;
  userInput: string;
  setUserInput: (value: string) => void;
  onUserSubmit: (e: FormEvent) => void;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

export function ChatDisplay({ 
  chatLog, 
  isGenerating, 
  isNarrating,
  elapsedTime, 
  agent1Name, 
  agent2Name, 
  t,
  userInput,
  setUserInput,
  onUserSubmit
}: ChatDisplayProps) {
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messageCount = chatLog.filter(m => m.agent !== 'User' && m.agent !== 'Narrator').length;

  useEffect(() => {
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [chatLog, isGenerating, isNarrating]);
  
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  return (
    <div className="flex h-screen flex-col bg-background">
       <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
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
              <div className="flex h-[calc(100vh-16rem)] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="mx-auto h-14 w-12" />
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
                    isNarrator={msg.agent === 'Narrator'}
                    isUser={msg.agent === 'User'}
                    t={t}
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
       <div className="shrink-0 border-t bg-muted/50 p-4">
        <form onSubmit={onUserSubmit} className="flex items-start gap-4">
            <Textarea
                ref={textareaRef}
                placeholder={t.narratorPlaceholder}
                className="min-h-[48px] max-h-40 flex-1 resize-none rounded-sm border-input bg-background shadow-sm"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onInput={handleInput}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onUserSubmit(e);
                        // Reset height after submit
                        if(textareaRef.current) {
                            textareaRef.current.style.height = 'auto';
                        }
                    }
                }}
                disabled={isNarrating || isGenerating}
            />
            <Button type="submit" size="icon" className="h-14 w-14 shrink-0 rounded-sm" disabled={isNarrating || isGenerating || !userInput.trim()}>
                {isNarrating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">{t.send}</span>
            </Button>
        </form>
    </div>
    </div>
  );
}
