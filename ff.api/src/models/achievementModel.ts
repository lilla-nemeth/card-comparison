import mongoose, { Schema, model, Document, Types, PopulatedDoc } from 'mongoose';

export enum AchievementType {
  skill = "skill",
  step = "step",
  quest = "quest",
}

export enum AchievementSize {
  normal = 'normal',
  mega = 'mega',
  giga = 'giga'
}

export interface AchievementRequirement {
  _id: Types.ObjectId;
  type: AchievementType;
  questId?: string;
  skillId?: string;
  stepId?: string;
  targetCount: number;
  any?: boolean;
}

export interface Achievement extends Document {
  name: string;
  description: string;
  requirement?: AchievementRequirement;
  size: AchievementSize;
  subAchievements: PopulatedDoc<Achievement[] & Document>[];
}

export const requirementSchema = new Schema<AchievementRequirement>({
  type: { type: String, enum: AchievementType, required: true },
  questId: String,
  skillId: String,
  stepId: String,
  targetCount: { type: Number, required: true },
  any: { type: Boolean, default: false }
}, {
  toJSON: {
    virtuals: true
  }
});

const achievementSchema = new Schema<Achievement>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  requirement: { type: requirementSchema, required: false },
  size: { type: String, enum: AchievementSize, required: true, default: AchievementSize.normal },
  subAchievements: [{ type: mongoose.Types.ObjectId, ref: 'Achievement' }]
},
  {
    toJSON: {
      virtuals: true
    }
  }
);

achievementSchema.path('requirement').validate(function (value) {
  return (this.subAchievements as Achievement[]).length > 0 || value != null;
}, 'Either requirement or subAchievements must be provided.');

export const AchievementModel = model<Achievement>('Achievement', achievementSchema);
