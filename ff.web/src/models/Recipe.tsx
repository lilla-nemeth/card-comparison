import { Step } from "./Step";
import { Resource } from "./Resource";
import { Media } from "./Media";

export enum RecipeState {
  notStarted = "NOT_STARTED",
  current = "CURRENT",
  done = "DONE"
}

export interface Recipe {
  id: string;
  resources: Resource[];
  name: string;
  media?: Media;
  state: RecipeState;
  steps: Step[];
  description: string;
  servingSize: string
}