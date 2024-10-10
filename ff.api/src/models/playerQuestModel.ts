import mongoose, { Schema } from 'mongoose';
import { IQuest } from './questModel';
import { IStep, StepSchema } from './stepModel';
import { IRecipe, RecipeSchema } from './recipeModel';
import { MediaSchema } from './mediaModel';

export enum PlayerQuestState {
  notStarted = "NOT_STARTED",
  inProgress = "IN_PROGRESS",
  completed = "COMPLETED"
}

export enum StepState {
  notStarted = "NOT_STARTED",
  challengeAccepted = "CHALLENGE_ACCEPTED",
  current = "CURRENT",
  completed = "COMPLETED",
  skipped = "SKIPPED"
}

interface IPlayerRecipeStep extends IStep {
  finishedAt?: Date;
  startAt?: Date;
  state: StepState;
  claimedBy?: mongoose.Types.ObjectId;
  finishedBy?: mongoose.Types.ObjectId;
}

export const PlayerRecipeStepSchema: Schema = new Schema({
  finishedAt: { type: Date, default: null },
  startAt: { type: Date, default: null },
  state: { type: String, enum: StepState, required: true, default: StepState.notStarted },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
  finishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null }
}, {
  toJSON: {
    virtuals: true
  }
})

PlayerRecipeStepSchema.add(StepSchema)

interface IPlayerRecipe extends Omit<IRecipe, 'steps'> {
  steps: IPlayerRecipeStep[];
}

const PlayerRecipeSchema: Schema = new Schema({}, {
  timestamps: true,
  toJSON: { virtuals: true }
});
PlayerRecipeSchema.add(RecipeSchema)
PlayerRecipeSchema.add({ steps: { type: [PlayerRecipeStepSchema], default: [] } })

interface IPlayerQuest extends Omit<IQuest, 'recipe'|'state'> {
  finishedAt?: Date;
  originalQuestId: string;
  recipe: IPlayerRecipe;
  scope: number;
  startedAt?: Date;
  state: PlayerQuestState;
  users: mongoose.Types.ObjectId[];
  userGroup?: mongoose.Types.ObjectId;
}

const PlayerQuestSchema: Schema = new Schema({
  finishedAt: { type: Date, default: null },
  media: { type: MediaSchema },
  name: { type: String, required: true },
  originalQuestId: { type: String, required: true },
  recipe: PlayerRecipeSchema,
  scope: { type: Number, required: true },
  startedAt: { type: Date, default: null },
  state: { type: String, enum: PlayerQuestState, required: true, default: PlayerQuestState.notStarted },
  tags: [{ type: mongoose.Types.ObjectId, ref: 'QuestTag' }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, default: [] }],
  userGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'UserGroup', required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

const PlayerQuest = mongoose.model<IPlayerQuest>('PlayerQuest', PlayerQuestSchema);

export default PlayerQuest;
export { IPlayerQuest };
