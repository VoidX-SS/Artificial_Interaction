'use server';

/**
 * @fileOverview Flow for generating the next turn in a conversation.
 *
 * - generateNextTurn - A function that generates a response from an agent.
 * - GenerateNextTurnInput - The input type for the generateNextTurn function.
 * - GenerateNextTurnOutput - The return type for the generateNextTurn function.
 */

import {ai, getAiWithApiKey} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNextTurnInputSchema = z.object({
  prompt: z.string().describe('The full prompt for the AI agent.'),
  apiKey: z.string().optional().describe('Optional API key for Google AI.'),
});

export type GenerateNextTurnInput = z.infer<typeof GenerateNextTurnInputSchema>;

const GenerateNextTurnOutputSchema = z.object({
    message: z.string().describe("The agent's text response for the conversation."),
    personality: z.object({
        emotionIndex: z.object({
            health: z.number(),
            appearance: z.number(),
            iq: z.number(),
            eq: z.number(),
            antipathy: z.number(),
        }),
        matrixConnection: z.object({
            connection: z.number(),
            trust: z.number(),
            intimacy: z.number(),
            dependency: z.number(),
        }),
    }),
    nextIntention: z.string().describe("The agent's next immediate intention."),
});


export type GenerateNextTurnOutput = z.infer<typeof GenerateNextTurnOutputSchema>;

export async function generateNextTurn(
  input: GenerateNextTurnInput
): Promise<GenerateNextTurnOutput> {
  const customAi = input.apiKey ? getAiWithApiKey(input.apiKey) : ai;

  const responseGenerationPrompt = customAi.definePrompt({
    name: 'responseGenerationPrompt',
    input: {schema: GenerateNextTurnInputSchema},
    output: {schema: GenerateNextTurnOutputSchema},
    prompt: `{{{prompt}}}`,
  });

  const generateNextTurnFlow = customAi.defineFlow(
    {
      name: 'generateNextTurnFlow',
      inputSchema: GenerateNextTurnInputSchema,
      outputSchema: GenerateNextTurnOutputSchema,
    },
    async flowInput => {
      const {output} = await responseGenerationPrompt(flowInput);
      return output!;
    }
  );
  
  return generateNextTurnFlow(input);
}
