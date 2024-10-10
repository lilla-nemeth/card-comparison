export enum AchievementType {
  skill = "skill",
  step = "step",
  quest = "quest",
}

export interface AchievementRequirement {
  id: string;
  type: AchievementType;
  questId?: string;
  skillId?: string;
  stepId?: string;
  targetCount: number;
  any?: boolean;
}
