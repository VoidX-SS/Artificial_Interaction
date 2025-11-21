import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// This is the default AI configuration that uses the environment variable.
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

// This function allows creating a temporary Genkit instance with a dynamic API key.
export function getAiWithApiKey(apiKey: string) {
    const customGoogleAI = googleAI({
        apiKey: apiKey,
    });
    return genkit({
        plugins: [customGoogleAI],
        model: 'googleai/gemini-2.5-flash',
    });
}
