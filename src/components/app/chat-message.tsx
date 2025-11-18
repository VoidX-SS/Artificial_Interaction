
"use client";

import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessageProps {
  agent: string;
  text: string;
  isAgent1: boolean;
}

export function ChatMessage({ agent, text, isAgent1 }: ChatMessageProps) {
  
  return (
    <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Avatar>
        <AvatarFallback className={isAgent1 ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
          <Bot className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="font-semibold">{agent}</p>
        <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
            {text.split('\n').map((line, index) => (
                <p key={index} className="mb-2 last:mb-0">{line}</p>
            ))}
        </div>
      </div>
    </div>
  );
}
