
import { z } from 'zod';

export type Gender = 'male' | 'female';

export const MessageSchema = z.object({
  agent: z.string(),
  text: z.string(),
  emotionIndex: z.any().optional(),
  matrixConnection: z.any().optional(),
});
export type Message = z.infer<typeof MessageSchema>;

// Agent Profile Schema (Partial for updates)
const AgentSoulBasicPersonaSchema = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
  gender: z.enum(['male', 'female']).optional(),
  nationality: z.string().optional(),
  location: z.string().optional(),
});
const AgentSoulBasicSchema = z.object({
  persona: AgentSoulBasicPersonaSchema.optional(),
  curiosityIndex: z.number().optional(),
  summaryDiary: z.string().optional(),
});
const AgentSoulAdvancedSocialPositionSchema = z.object({
  job: z.string().optional(),
  financialStatus: z.string().optional(),
  qualityOfLife: z.number().optional(),
  happinessIndex: z.number().optional(),
});
const AgentSoulAdvancedSchema = z.object({
  socialPosition: AgentSoulAdvancedSocialPositionSchema.optional(),
  relationships: z.string().optional(),
});
const AgentSoulSchema = z.object({
  basic: AgentSoulBasicSchema.optional(),
  advanced: AgentSoulAdvancedSchema.optional(),
});

const AgentMatrixEmotionIndexSchema = z.object({
  health: z.number().optional(),
  appearance: z.number().optional(),
  iq: z.number().optional(),
  eq: z.number().optional(),
  antipathy: z.number().optional(),
  nextIntention: z.string().optional(),
});
const AgentMatrixConnectionSchema = z.object({
  connection: z.number().optional(),
  trust: z.number().optional(),
  intimacy: z.number().optional(),
  dependency: z.number().optional(),
});
const AgentMatrixFavorSchema = z.object({
  dob: z.string().optional(),
  zodiac: z.string().optional(),
  personalityType: z.string().optional(),
  thinkingStyle: z.string().optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  hobbies: z.string().optional(),
  dislikes: z.string().optional(),
  dreams: z.string().optional(),
  coreBeliefs: z.string().optional(),
  lifePhilosophy: z.string().optional(),
  pastTrauma: z.string().optional(),
});
const AgentMatrixSchema = z.object({
  emotionIndex: AgentMatrixEmotionIndexSchema.optional(),
  matrixConnection: AgentMatrixConnectionSchema.optional(),
  matrixFavor: AgentMatrixFavorSchema.optional(),
});

// Full Agent Profile Schema for initial state and loading
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
export type AgentMatrix = AgentProfile['matrix'];

// Narrator Schemas
export const NarratorInputSchema = z.object({
  agent1: AgentProfileSchema.describe("The full profile of Agent 1."),
  agent2: AgentProfileSchema.describe("The full profile of Agent 2."),
  history: z.array(MessageSchema).describe('The conversation history.'),
  userQuery: z.string().describe("The user's query to the narrator."),
  language: z.string().describe('The language for the response (e.g., "en" or "vi").'),
  apiKey: z.string().optional().describe('Optional API key for Google AI.'),
  topic: z.string().describe('Current conversation topic.'),
  relationship: z.string().describe('Current relationship between agents.'),
  pronouns: z.string().describe('Current pronouns used.'),
  temperature: z.number().describe('Current model temperature.'),
  maxWords: z.number().describe('Current max words per message.'),
  exchanges: z.number().describe('Current number of exchanges left.'),
});
export type NarratorInput = z.infer<typeof NarratorInputSchema>;

// This schema defines the flat JSON object the AI must return.
export const NarratorOutputSchema = z.object({
  response: z.string().describe("The narrator's confirmation message to the user."),
  topic: z.string().optional(),
  relationship: z.string().optional(),
  pronouns: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxWords: z.number().min(10).max(2000).optional(),
  exchanges: z.number().min(1).max(50).optional(),
  agent1Profile: z.object({ soul: AgentSoulSchema.optional(), matrix: AgentMatrixSchema.optional() }).optional(),
  agent2Profile: z.object({ soul: AgentSoulSchema.optional(), matrix: AgentMatrixSchema.optional() }).optional(),
});
export type NarratorOutput = z.infer<typeof NarratorOutputSchema>;


// Type guard to check if a response is a NarratorResponseSet
export function isNarratorResponseSet(obj: any): obj is NarratorOutput {
  return obj && typeof obj === 'object' && 'response' in obj && (
    'topic' in obj ||
    'relationship' in obj ||
    'pronouns' in obj ||
    'temperature' in obj ||
    'maxWords' in obj ||
    'exchanges' in obj ||
    'agent1Profile' in obj ||
    'agent2Profile' in obj
  );
}


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
