import { FlavourFlowMeal } from "./dataTypes";

interface ChoiceUIProps {
  handleChoice: (winner: FlavourFlowMeal, loser: FlavourFlowMeal) => void;
  setMeals?: React.Dispatch<React.SetStateAction<FlavourFlowMeal[]>>;
  isAnimating?: boolean;
  meals?: FlavourFlowMeal[];
}

export type { ChoiceUIProps };
