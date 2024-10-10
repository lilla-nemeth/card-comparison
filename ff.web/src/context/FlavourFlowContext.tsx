import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import { createContext, useState, useContext, useMemo, useEffect } from "react";
import { dataset } from "@vuo/utils/FlavourFlowData";
import {
  calculateElo,
  createDataForRanking,
  drawNewPair,
  findPairsByCategories,
  probability,
  updateElo,
} from "@vuo/utils/FlavourFlowFunctions";
import { FlavourFlowContextType } from "@vuo/types/contextProps";

const FlavourFlowContext = createContext<FlavourFlowContextType>({
  meals: [],
  setMeals: () => {},
  currentPair: [],
  setCurrentPair: () => {},
  handleChoice: () => {},
  clickedMeals: new Set(),
  setClickedMeals: new Set(),
  pairs: [],
});

export const FlavourFlowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [meals, setMeals] = useState<FlavourFlowMeal[]>(
    createDataForRanking(dataset),
  );
  const [currentPair, setCurrentPair] = useState<FlavourFlowMeal[]>([]);
  const [clickedMeals, setClickedMeals] = useState<Set<string>>(new Set());

  // useMemo to only render pairs when they're needed
  const pairs: FlavourFlowMeal[][] = useMemo(
    () => findPairsByCategories(meals),
    [meals],
  );

  useEffect(() => {
    if (pairs.length > 0) {
      drawNewPair(setCurrentPair, pairs, clickedMeals);
    } else {
      setCurrentPair([]);
    }
  }, [meals, pairs, setCurrentPair, clickedMeals]);

  const handleChoice = (winner: FlavourFlowMeal, loser: FlavourFlowMeal) => {
    const { newWinnerElo, newLoserElo } = calculateElo(
      winner,
      loser,
      probability,
    );

    setMeals((prevMeals) =>
      updateElo(prevMeals, winner, loser, newWinnerElo, newLoserElo),
    );

    setClickedMeals((prev) => new Set(prev).add(winner.id).add(loser.id));
  };

  return (
    <FlavourFlowContext.Provider
      value={{
        meals,
        setMeals,
        currentPair,
        setCurrentPair,
        handleChoice,
        clickedMeals,
        pairs,
        setClickedMeals,
      }}
    >
      {children}
    </FlavourFlowContext.Provider>
  );
};

export const useFlavourFlow = () => useContext(FlavourFlowContext);
