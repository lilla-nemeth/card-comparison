import { AchievementRequirement } from "./AchievementRequirement";

export enum AchievementSize {
  normal = "normal",
  mega = "mega",
  giga = "giga",
}

export interface Achievement {
  _id: string;
  name: string;
  description: string;
  parent: Achievement[];
  requirement?: AchievementRequirement;
  size: AchievementSize;
  subAchievements: Achievement[];
  id?: string;
}
