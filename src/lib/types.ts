
export type Gender = 'male' | 'female';

export interface AgentProfile {
  soul: AgentSoul;
  matrix: AgentMatrix;
}

export interface AgentSoul {
  basic: {
    persona: {
      name: string;
      age: number;
      gender: Gender;
      nationality: string;
      location: string;
    };
    curiosityIndex: number;
    summaryDiary: string;
  };
  advanced: {
    socialPosition: {
      job: string;
      financialStatus: string;
      qualityOfLife: number;
      happinessIndex: number;
    };
    relationships: string;
  };
}

export interface AgentMatrix {
  emotionIndex: {
    health: number;
    appearance: number;
    iq: number;
    eq: number;
    antipathy: number;
    nextIntention: string;
  };
  matrixConnection: {
    connection: number;
    trust: number;
    intimacy: number;
    dependency: number;
  };
  matrixFavor: {
    dob: string;
    zodiac: string;
    personalityType: string;
    thinkingStyle: string;
    strengths: string;
    weaknesses: string;
    hobbies: string;
    dislikes: string;
    dreams: string;
    coreBeliefs: string;
    lifePhilosophy: string;
    pastTrauma: string;
  };
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
            summaryDiary: 'A pragmatic and cautious scientist who weighs the risks and ethical implications of every decision.'
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
            summaryDiary: 'A visionary artist and dreamer who sees boundless potential and beauty in the cosmos.'
        },
    }
};
