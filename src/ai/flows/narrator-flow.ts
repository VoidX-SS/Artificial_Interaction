'use server';
/**
 * @fileOverview A narrator AI agent that observes and comments on conversations.
 *
 * - narrator - A function that handles the narrator's response process.
 */
import {ai, getAiWithApiKey} from '@/ai/genkit';
import {z} from 'genkit';
import {
  NarratorInputSchema,
  NarratorOutputSchema,
} from '@/lib/types';
import type {
  NarratorInput,
  NarratorOutput,
} from '@/lib/types';


export async function narrator(
  input: NarratorInput
): Promise<NarratorOutput> {
  const customAi = input.apiKey ? getAiWithApiKey(input.apiKey) : ai;

  const narratorPrompt = customAi.definePrompt({
    name: 'narratorPrompt',
    input: {schema: NarratorInputSchema},
    output: {schema: NarratorOutputSchema},
    prompt: `You are a narrator observing a conversation between two AI agents. Your role is to provide insightful commentary, analysis, or even steer the conversation based on the user's query.

--- CONVERSATION CONTEXT ---
*   **Agent 1 Profile:**
    \`\`\`json
    {{{agent1}}}
    \`\`\`
*   **Agent 2 Profile:**
    \`\`\`json
    {{{agent2}}}
    \`\`\`
*   **Conversation History:**
{{#each history}}
    - {{agent}}: {{text}}
{{/each}}
{{#if (eq history.length 0)}}
    The conversation has not started yet.
{{/if}}

--- USER'S REQUEST ---
"{{{userQuery}}}"

--- YOUR TASK ---
Based on the context and the user's request, provide a response as the narrator. Your response should be insightful and relevant to the ongoing conversation and the user's query. Output a JSON object with a "response" field.`,
  });

  const narratorFlow = customAi.defineFlow(
    {
      name: 'narratorFlow',
      inputSchema: NarratorInputSchema,
      outputSchema: NarratorOutputSchema,
    },
    async flowInput => {
      const {output} = await narratorPrompt(flowInput);
      return output!;
    }
  );

  return narratorFlow(input);
}
