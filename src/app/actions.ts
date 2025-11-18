// src/app/actions.ts
'use server';

import { generateAIPersonality, type GenerateAIPersonalityInput } from '@/ai/flows/generate-ai-personality';
import { generateConversationStarter } from '@/ai/flows/generate-conversation-starter';
import type { Language } from '@/lib/i18n';

export async function generatePersonalityAction(description: string, language: Language): Promise<string> {
  try {
    const result = await generateAIPersonality({ description, language });
    return result.personality;
  } catch (error) {
    console.error('Error generating personality:', error);
    return 'Error: Could not generate a personality. Please check your API key and network connection.';
  }
}

export async function generateChatResponseAction(prompt: string): Promise<string> {
  try {
    // We use the 'generateConversationStarter' flow creatively to generate each turn.
    // The 'topic' input is repurposed to carry the full context, including personality and history.
    const result = await generateConversationStarter({ topic: prompt });
    return result.conversationStarter;
  } catch (error) {
    console.error('Error generating chat response:', error);
    return 'Error: Could not get a response. Please check your API key and network connection.';
  }
}
