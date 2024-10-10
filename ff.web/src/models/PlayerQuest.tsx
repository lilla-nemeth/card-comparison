import { ChannelUser } from "@vuo/stores/WebSocketStore";
import { Quest } from "./Quest";
import { Recipe } from "./Recipe";
import { Step } from "./Step";

export interface User {
  id: string;
  username: string;
}

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

export interface PlayerQuestStep extends Step {
  id: string;
  finishedAt?: Date;
  startAt?: Date;
  state: StepState;
  subSteps?: PlayerQuestStep[];
  claimedBy?: ChannelUser;
  finishedBy?: ChannelUser;
}

export interface PlayerQuestRecipe extends Omit<Recipe, 'steps'> {
  steps: PlayerQuestStep[];
}

export interface PlayerQuest extends Omit<Quest, 'recipe'> {
  id: string;
  finishedAt?: Date;
  originalQuestId: string;
  recipe: PlayerQuestRecipe;
  startedAt?: Date;
  state: PlayerQuestState;
}