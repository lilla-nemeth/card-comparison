type AppContextPropTypes = {
  children: React.ReactNode;
};

// Define the shape of your context value
interface AppContextValue {
  // Add your context properties and methods here
  isOnboardingComplete: boolean;
  setIsOnboardingComplete: (value: boolean) => void;
}

interface FlavourFlowContextType {
  meals: FlavourFlowMeal[];
  setMeals: Dispatch<SetStateAction<FlavourFlowMeal[]>>;
  currentPair: FlavourFlowMeal[];
  setCurrentPair: Dispatch<SetStateAction<FlavourFlowMeal[]>>;
  handleChoice: (winner: FlavourFlowMeal, loser: FlavourFlowMeal) => void;
  setClickedMeals?: Dispatch<SetStateAction<Set<string>>>;
  attributePairs?: FlavourFlowMeal[][];
  categoryPairs?: FlavourFlowMeal[][];
  drawAttributePair?: Dispatch<SetStateAction<FlavourFlowMeal[]>>;
}

export type { AppContextPropTypes, AppContextValue, FlavourFlowContextType };
