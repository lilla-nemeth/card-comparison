import { Schema, model, Document } from 'mongoose';
import { Achievement } from './achievementModel';

interface AchievementProgress {
  currentCount: number;
  completed: boolean;
}

export interface PlayerAchievement extends Document {
  playerId: string;
  achievement: Achievement;
  progress?: AchievementProgress;
  questId?: string;
  seenAt?: Date;
  unlockedAt?: Date;
  completed: boolean;
}

const progressSchema = new Schema<AchievementProgress>({
  currentCount: { type: Number, required: true },
  completed: { type: Boolean, required: true },
});

const playerAchievementSchema = new Schema<PlayerAchievement>({
  playerId: { type: String, required: true },
  achievement: { type: Schema.Types.ObjectId, ref: 'Achievement', required: true },
  progress: { type: progressSchema, required: false },
  completed: { type: Boolean, default: false },
  questId: String,
  seenAt: Date,
  unlockedAt: Date
}, {
  toJSON: { virtuals: true }
});

export const PlayerAchievementModel = model<PlayerAchievement>('PlayerAchievement', playerAchievementSchema);
