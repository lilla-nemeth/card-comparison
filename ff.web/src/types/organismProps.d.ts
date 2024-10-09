import { FlavourFlowMeal } from "./dataTypes";

interface ChoiceUIProps {
  handleChoice: (winner: FlavourFlowMeal, loser: FlavourFlowMeal) => void;
  isAnimating?: boolean;
  meals: FlavourFlowMeal[];
  setIsAnimating?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ResultUIProps {
  meals: FlavourFlowMeal[];
}

export type { ChoiceUIProps, ResultUIProps };
