import { v4 as uuid } from 'uuid';
import { Resource } from "./Resource";

export interface RecipeTool {
  icon: string;
  name: string;
}

interface StepMedia {
  id: string;
  image?: string;
  video?: string;
}

export interface Skill {
  id: string;
  name: string;
  challenge_rating: number;
  skill_category: string;
  difficulty_level: string;
};

export enum HighlightType {
  Normal = 'normal',
  Challenge = 'challenge',
}

export interface ReviewStatus {
  processed: boolean;
  textVerified: boolean;
  ingredientsVerified: boolean;
  mediaGenerated: boolean;
  mediaApproved: boolean;
  skillsAssigned: boolean;
}

export type CombinedSkill = Partial<Skill> & Pick<Skill, 'challenge_rating' | 'name'>

export interface Step {
  id: string;
  attachable: boolean;
  downtime?: number;
  highlight?: HighlightType;
  media?: StepMedia;
  rawData?: string;
  resources?: Resource[];
  reviewStatus: ReviewStatus;
  skills: Skill[];
  subSteps?: Step[];
  suggestedMedias: StepMedia[];
  text: string;
  tools?: RecipeTool[]
};

export function createNewStep(overrides?: Partial<Step>): Step {
  return {
    id: uuid(),
    attachable: false,
    text: '',
    downtime: 0,
    highlight: HighlightType.Normal,
    reviewStatus: {
      processed: false,
      textVerified: false,
      ingredientsVerified: false,
      mediaGenerated: false,
      mediaApproved: false,
      skillsAssigned: false
    },
    suggestedMedias: [],
    skills: [],
    tools: [],
    resources: [],
    ...overrides
  };
}