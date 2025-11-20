
// src/app/actions.ts
'use server';

import { generateNextTurn } from '@/ai/flows/generate-conversation-starter';
import type { GenerateNextTurnOutput } from '@/ai/flows/generate-conversation-starter';

export async function generateChatResponseAction(prompt: string, apiKey?: string): Promise<GenerateNextTurnOutput | string> {
  try {
    const result = await generateNextTurn({ prompt, apiKey });
    return result;
  } catch (error: any) {
    console.error('Error generating chat response:', error);
    const errorMessage = error.cause?.message || error.message || 'An unknown error occurred.';
    return `Error: Could not get a response. ${errorMessage}`;
  }
}
