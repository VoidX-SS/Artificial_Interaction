'use server';

/**
 * @fileOverview Flow for generating a conversation starter for the AI agents.
 *
 * - generateConversationStarter - A function that generates a conversation starter.
 * - GenerateConversationStarterInput - The input type for the generateConversationStarter function.
 * - GenerateConversationStarterOutput - The return type for the generateConversationStarter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConversationStarterInputSchema = z.object({
  topic: z.string().describe('The topic or starting prompt for the conversation.'),
});

export type GenerateConversationStarterInput = z.infer<
  typeof GenerateConversationStarterInputSchema
>;

const GenerateConversationStarterOutputSchema = z.object({
  conversationStarter: z.string().describe('The generated conversation starter.'),
});

export type GenerateConversationStarterOutput = z.infer<
  typeof GenerateConversationStarterOutputSchema
>;

export async function generateConversationStarter(
  input: GenerateConversationStarterInput
): Promise<GenerateConversationStarterOutput> {
  return generateConversationStarterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConversationStarterPrompt',
  input: {schema: GenerateConversationStarterInputSchema},
  output: {schema: GenerateConversationStarterOutputSchema},
  prompt: `You are an AI assistant helping to start a conversation between two AI agents.

  Based on the given topic or starting prompt, generate a suitable conversation starter.

  Topic/Starting Prompt: {{{topic}}}

  Conversation Starter: `,
});

const generateConversationStarterFlow = ai.defineFlow(
  {
    name: 'generateConversationStarterFlow',
    inputSchema: GenerateConversationStarterInputSchema,
    outputSchema: GenerateConversationStarterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
