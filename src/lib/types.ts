
import { z } from 'zod';

export type Gender = 'male' | 'female';

// Basic Message Schema
export const MessageSchema = z.object({
  agent: z.string(),
  text: z.string(),
  emotionIndex: z.any().optional(),
  matrixConnection: z.any().optional(),
});
export type Message = z.infer<typeof MessageSchema>;


// Agent Profile Schema
export const AgentProfileSchema = z.object({
  soul: z.object({
    basic: z.object({
      persona: z.object({
        name: z.string(),
        age: z.number(),
        gender: z.enum(['male', 'female']),
        nationality: z.string(),
        location: z.string(),
      }),
      curiosityIndex: z.number(),
      summaryDiary: z.string(),
    }),
    advanced: z.object({
      socialPosition: z.object({
        job: z.string(),
        financialStatus: z.string(),
        qualityOfLife: z.number(),
        happinessIndex: z.number(),
      }),
      relationships: z.string(),
    }),
  }),
  matrix: z.object({
    emotionIndex: z.object({
      health: z.number(),
      appearance: z.number(),
      iq: z.number(),
      eq: z.number(),
      antipathy: z.number(),
      nextIntention: z.string(),
    }),
    matrixConnection: z.object({
      connection: z.number(),
      trust: z.number(),
      intimacy: z.number(),
      dependency: z.number(),
    }),
    matrixFavor: z.object({
      dob: z.string(),
      zodiac: z.string(),
      personalityType: z.string(),
      thinkingStyle: z.string(),
      strengths: z.string(),
      weaknesses: z.string(),
      hobbies: z.string(),
      dislikes: z.string(),
      dreams: z.string(),
      coreBeliefs: z.string(),
      lifePhilosophy: z.string(),
      pastTrauma: z.string(),
    }),
  }),
});
export type AgentProfile = z.infer<typeof AgentProfileSchema>;

// Narrator Schemas
export const NarratorInputSchema = z.object({
  agent1: z.string().describe("A JSON string representing Agent 1's profile."),
  agent2: z.string().describe("A JSON string representing Agent 2's profile."),
  history: z.array(MessageSchema).describe('The conversation history.'),
  userQuery: z.string().describe("The user's query to the narrator."),
  language: z.string().describe('The language for the response (e.g., "en" or "vi").'),
  apiKey: z.string().optional().describe('Optional API key for Google AI.'),
});
export type NarratorInput = z.infer<typeof NarratorInputSchema>;

export const NarratorOutputSchema = z.object({
  response: z.string().describe("The narrator's response to the user's query."),
});
export type NarratorOutput = z.infer<typeof NarratorOutputSchema>;


const emptyProfile: AgentProfile = {
  soul: {
    basic: {
      persona: {
        name: '',
        age: 30,
        gender: 'male',
        nationality: '',
        location: '',
      },
      curiosityIndex: 50,
      summaryDiary: '',
    },
    advanced: {
      socialPosition: {
        job: '',
        financialStatus: '',
        qualityOfLife: 50,
        happinessIndex: 50,
      },
      relationships: '',
    },
  },
  matrix: {
    emotionIndex: {
      health: 80,
      appearance: 70,
      iq: 120,
      eq: 110,
      antipathy: 10,
      nextIntention: '',
    },
    matrixConnection: {
      connection: 20,
      trust: 20,
      intimacy: 10,
      dependency: 10,
    },
    matrixFavor: {
      dob: '',
      zodiac: '',
      personalityType: '',
      thinkingStyle: '',
      strengths: '',
      weaknesses: '',
      hobbies: '',
      dislikes: '',
      dreams: '',
      coreBeliefs: '',
      lifePhilosophy: '',
      pastTrauma: '',
    },
  },
};

export const initialAgent1Profile: AgentProfile = {
    ...JSON.parse(JSON.stringify(emptyProfile)),
    soul: {
        ...JSON.parse(JSON.stringify(emptyProfile.soul)),
        basic: {
            ...JSON.parse(JSON.stringify(emptyProfile.soul.basic)),
            persona: {
                ...JSON.parse(JSON.stringify(emptyProfile.soul.basic.persona)),
                name: 'Agent 1',
                gender: 'male',
            },
        },
    }
};

export const initialAgent2Profile: AgentProfile = {
    ...JSON.parse(JSON.stringify(emptyProfile)),
    soul: {
        ...JSON.parse(JSON.stringify(emptyProfile.soul)),
        basic: {
            ...JSON.parse(JSON.stringify(emptyProfile.soul.basic)),
            persona: {
                ...JSON.parse(JSON.stringify(emptyProfile.soul.basic.persona)),
                name: 'Agent 2',
                gender: 'female',
            },
        },
    }
};
