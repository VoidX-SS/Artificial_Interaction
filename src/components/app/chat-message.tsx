
"use client";

import { Bot, BookUser, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { I18n } from '@/lib/i18n';

interface ChatMessageProps {
  agent: string;
  text: string;
  isAgent1: boolean;
  isNarrator: boolean;
  isUser: boolean;
  t: I18n;
}

export function ChatMessage({ agent, text, isAgent1, isNarrator, isUser, t }: ChatMessageProps) {
  
  if (isNarrator) {
    return (
      <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <Avatar>
          <AvatarFallback className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
            <BookUser className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <p className="font-semibold">{t.narrator}</p>
          <div className="prose prose-sm max-w-none rounded-md border border-amber-200 bg-amber-50/50 p-3 text-foreground dark:border-amber-900 dark:bg-amber-950/50 dark:prose-invert font-chat">
            {text.split('\n').map((line, index) => (
                <p key={index} className="mb-2 last:mb-0 text-justify">{line}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex items-start gap-4 justify-end animate-in fade-in slide-in-from-bottom-2 duration-500">
         <div className="flex-1 space-y-1 max-w-[80%]">
          <p className="font-semibold text-right">You</p>
          <div className="prose prose-sm max-w-none rounded-md bg-primary p-3 text-primary-foreground dark:prose-invert font-chat">
            {text.split('\n').map((line, index) => (
                <p key={index} className="mb-2 last:mb-0">{line}</p>
            ))}
          </div>
        </div>
        <Avatar>
          <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Avatar>
        <AvatarFallback className={isAgent1 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" : "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"}>
          <Bot className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="font-semibold">{agent}</p>
        <div className="prose prose-sm max-w-none text-foreground dark:prose-invert font-chat">
            {text.split('\n').map((line, index) => (
                <p key={index} className="mb-2 last:mb-0">{line}</p>
            ))}
        </div>
      </div>
    </div>
  );
}
