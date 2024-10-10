import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import { createContext, useState, useContext, useMemo, useEffect } from "react";
import { dataset } from "@vuo/utils/FlavourFlowData";
import {
  calculateElo,
  createDataForRanking,
  drawNewPair,
  findPairsByCategories,
  getWinnersByAttributes,
  probability,
  updateElo,
  findRandomPairs,
} from "@vuo/utils/FlavourFlowFunctions";
import { FlavourFlowContextType } from "@vuo/types/contextProps";

const FlavourFlowContext = createContext<FlavourFlowContextType>({
  meals: [],
  setMeals: () => {},
  currentPair: [],
  setCurrentPair: () => {},
  handleChoice: () => {},
  setClickedMeals: new Set(),
  attributePairs: [],
  categoryPairs: [],
  drawAttributePair: [],
});

export const FlavourFlowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [meals, setMeals] = useState<FlavourFlowMeal[]>(() =>
    createDataForRanking(dataset),
  );
  const [currentPair, setCurrentPair] = useState<FlavourFlowMeal[]>([]);
  const [clickedMeals, setClickedMeals] = useState<Set<string>>(new Set());

  const attributePairs = useMemo<FlavourFlowMeal[][]>(() => {
    return findPairsByCategories(meals);
  }, [meals]);

  const winnersByAttributes = useMemo(
    () => getWinnersByAttributes(meals),
    [meals],
  );

  const categoryPairs = useMemo<FlavourFlowMeal[][]>(() => {
    return findRandomPairs(winnersByAttributes);
  }, [meals]);

  const drawAttributePair = drawNewPair(attributePairs, clickedMeals);
  useEffect(() => {
    if (drawAttributePair.length > 0) {
      setCurrentPair(drawAttributePair);
    } else {
      // setClickedMeals(new Set());
      if (categoryPairs.length > 0) {
        const drawCategoryPair = drawNewPair(categoryPairs, clickedMeals);
        if (drawAttributePair.length > 0) {
          setCurrentPair(drawCategoryPair);
        } else {
          setCurrentPair([]);
        }
      }
    }
  }, [meals, attributePairs, setCurrentPair, clickedMeals]);

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
        attributePairs,
        categoryPairs,
        setClickedMeals,
        drawAttributePair,
      }}
    >
      {children}
    </FlavourFlowContext.Provider>
  );
};

export const useFlavourFlow = () => useContext(FlavourFlowContext);
