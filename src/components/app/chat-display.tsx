"use client";

import { MessageSquare, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/app/chat-message';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Message } from '@/app/page';

interface ChatDisplayProps {
  chatLog: Message[];
  isGenerating: boolean;
}

export function ChatDisplay({ chatLog, isGenerating }: ChatDisplayProps) {
  return (
    <div className="flex h-full flex-col">
       <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-card px-4">
        <h1 className="text-lg font-semibold">Conversation</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 md:p-6">
            {chatLog.length === 0 ? (
              <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12" />
                  <p className="mt-4 text-lg">The conversation will appear here.</p>
                  <p className="mt-1 text-sm">
                    Configure the settings and press "Start Conversation".
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {chatLog.map((msg, index) => (
                  <ChatMessage key={index} agent={msg.agent} text={msg.text} />
                ))}
                 {isGenerating && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                        <div className="w-full text-muted-foreground">Typing...</div>
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
