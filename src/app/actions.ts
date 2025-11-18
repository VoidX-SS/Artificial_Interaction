
// src/app/actions.ts
'use server';

import { generateAIPersonality } from '@/ai/flows/generate-ai-personality';
import { generateConversationStarter } from '@/ai/flows/generate-conversation-starter';
import type { Language } from '@/lib/i18n';

export async function generatePersonalityAction(description: string, language: Language, apiKey?: string): Promise<string> {
  try {
    const result = await generateAIPersonality({ description, language, apiKey });
    return result.personality;
  } catch (error: any) {
    console.error('Error generating personality:', error);
    const errorMessage = error.cause?.message || error.message || 'An unknown error occurred.';
    return `Error: Could not generate a personality. ${errorMessage}`;
  }
}

export async function generateChatResponseAction(prompt: string, apiKey?: string): Promise<string> {
  try {
    // We use the 'generateConversationStarter' flow creatively to generate each turn.
    // The 'topic' input is repurposed to carry the full context, including personality and history.
    const result = await generateConversationStarter({ topic: prompt, apiKey });
    return result.conversationStarter;
  } catch (error: any) {
    console.error('Error generating chat response:', error);
    const errorMessage = error.cause?.message || error.message || 'An unknown error occurred.';
    return `Error: Could not get a response. ${errorMessage}`;
  }
}
