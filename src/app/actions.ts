// src/app/actions.ts
'use server';

import { generateAIPersonality } from '@/ai/flows/generate-ai-personality';
import { generateConversationStarter } from '@/ai/flows/generate-conversation-starter';

export async function generatePersonalityAction(description: string): Promise<string> {
  try {
    const result = await generateAIPersonality({ description });
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
