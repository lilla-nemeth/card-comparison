import { AdminRecipe } from "@vuo/viewModels/RecipeGeneratorViewModel";
import { Recipe } from "./Recipe";
import { MiniGame } from "./MiniGame";
import { Media } from "./Media";

export interface QuestTag {
  title: string;
}

export interface Quest {
  id: string;
  tags: QuestTag[];
  miniGames: MiniGame[];
  media?: Media;
  name: string;
  recipe: Recipe | AdminRecipe;
}