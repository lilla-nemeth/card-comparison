import { FlavourFlowMeal } from "./dataTypes";

interface ChoiceUIProps {
  handleChoice: (winner: FlavourFlowMeal, loser: FlavourFlowMeal) => void;
  meals: FlavourFlowMeal[];
}

export type { ChoiceUIProps };
