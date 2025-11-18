
// src/ai/flows/generate-ai-personality.ts
'use server';

/**
 * @fileOverview Generates an AI personality based on a given description.
 *
 * - generateAIPersonality - A function that generates the AI personality.
 * - GenerateAIPersonalityInput - The input type for the generateAIPersonality function.
 * - GenerateAIPersonalityOutput - The return type for the generateAIPersonality function.
 */

import {ai, getAiWithApiKey} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAIPersonalityInputSchema = z.object({
  description: z.string().describe('A description of the desired AI personality. This should be a summary of their life, experiences, and core traits.'),
  language: z.enum(['en', 'vi']).optional().default('en').describe('The language for the generated personality diary.'),
  apiKey: z.string().optional().describe('Optional API key for Google AI.'),
});
export type GenerateAIPersonalityInput = z.infer<typeof GenerateAIPersonalityInputSchema>;

const GenerateAIPersonalityOutputSchema = z.object({
  personality: z.string().describe('The generated AI summary diary.'),
});
export type GenerateAIPersonalityOutput = z.infer<typeof GenerateAIPersonalityOutputSchema>;

export async function generateAIPersonality(input: GenerateAIPersonalityInput): Promise<GenerateAIPersonalityOutput> {
  const customAi = input.apiKey ? getAiWithApiKey(input.apiKey) : ai;

  const prompt = customAi.definePrompt({
    name: 'generateAIPersonalityPrompt',
    input: {schema: GenerateAIPersonalityInputSchema},
    output: {schema: GenerateAIPersonalityOutputSchema},
    prompt: `You are an AI that generates a rich, narrative summary diary for a fictional character based on a description.
This diary should encapsulate their key life events, memories, relationships, and traumas that have shaped them.
Base the summary diary on the following description: {{{description}}}
The generated diary MUST be in {{#if (eq language 'vi')}}Vietnamese{{else}}English{{/if}}.
`,
  });

  const generateAIPersonalityFlow = customAi.defineFlow(
    {
      name: 'generateAIPersonalityFlow',
      inputSchema: GenerateAIPersonalityInputSchema,
      outputSchema: GenerateAIPersonalityOutputSchema,
    },
    async (flowInput) => {
      const {output} = await prompt(flowInput);
      return output!;
    }
  );

  return generateAIPersonalityFlow(input);
}
