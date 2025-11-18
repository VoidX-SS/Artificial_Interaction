// src/ai/flows/generate-ai-personality.ts
'use server';

/**
 * @fileOverview Generates an AI personality based on a given description.
 *
 * - generateAIPersonality - A function that generates the AI personality.
 * - GenerateAIPersonalityInput - The input type for the generateAIPersonality function.
 * - GenerateAIPersonalityOutput - The return type for the generateAIPersonality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAIPersonalityInputSchema = z.object({
  description: z.string().describe('A description of the desired AI personality.'),
});
export type GenerateAIPersonalityInput = z.infer<typeof GenerateAIPersonalityInputSchema>;

const GenerateAIPersonalityOutputSchema = z.object({
  personality: z.string().describe('The generated AI personality.'),
});
export type GenerateAIPersonalityOutput = z.infer<typeof GenerateAIPersonalityOutputSchema>;

export async function generateAIPersonality(input: GenerateAIPersonalityInput): Promise<GenerateAIPersonalityOutput> {
  return generateAIPersonalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAIPersonalityPrompt',
  input: {schema: GenerateAIPersonalityInputSchema},
  output: {schema: GenerateAIPersonalityOutputSchema},
  prompt: `You are an AI personality generator. Generate a personality based on the following description: {{{description}}}`,
});

const generateAIPersonalityFlow = ai.defineFlow(
  {
    name: 'generateAIPersonalityFlow',
    inputSchema: GenerateAIPersonalityInputSchema,
    outputSchema: GenerateAIPersonalityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
