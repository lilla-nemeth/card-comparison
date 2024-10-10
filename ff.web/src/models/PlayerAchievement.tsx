import { Achievement } from "./Achievement";

export interface PlayerAchievement {
  id: string;
  achievement: Achievement;
  progress?: AchievementProgress;
  questId?: string;           // Optional, in which quest this achievement was unlocked
  seenAt?: Date;                    // Optional, might not have been seen yet
  unlockedAt?: Date;                // Optional, as the achievement might not be unlocked yet, e.g., if achievement targetCount is >1
  completed?: boolean;
}

interface AchievementProgress {
  currentCount: number;   // Current progress count towards the requirement
  completed: boolean;     // Whether this requirement is fully completed
}
