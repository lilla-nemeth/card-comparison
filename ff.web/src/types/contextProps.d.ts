type AppContextPropTypes = {
  children: React.ReactNode;
};

// Define the shape of your context value
interface AppContextValue {
  // Add your context properties and methods here
  isOnboardingComplete: boolean;
  setIsOnboardingComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FlavourFlowContextType {
  meals: FlavourFlowMeal[];
  setMeals: Dispatch<SetStateAction<FlavourFlowMeal[]>>;
  currentPair: FlavourFlowMeal[];
  setCurrentPair: Dispatch<SetStateAction<FlavourFlowMeal[]>>;
  clickedMeals: Set<string>;
  handleChoice: (winner: FlavourFlowMeal, loser: FlavourFlowMeal) => void;
  pairs: FlavourFlowMeal[][];
  setClickedMeals?: Dispatch<SetStateAction<Set<string>>>;
}

export type { AppContextPropTypes, AppContextValue, FlavourFlowContextType };
