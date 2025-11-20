
// src/app/actions.ts
'use server';

import { generateConversationStarter } from '@/ai/flows/generate-conversation-starter';

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
