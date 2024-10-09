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
  isAnimating: boolean;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
  clickedMeals: Set<string>;
  handleChoice: (winner: FlavourFlowMeal, loser: FlavourFlowMeal) => void;
}

export type { AppContextPropTypes, AppContextValue, FlavourFlowContextType };
