import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import { createContext, useState, useContext, useEffect } from "react";
import { dataset } from "@vuo/utils/FlavourFlowData";
import {
  calculateElo,
  createDataForRanking,
  drawNewPair,
  findPairsByQuestionset,
  probability,
  updateElo,
} from "@vuo/utils/FlavourFlowFunctions";
import { FlavourFlowContextType } from "@vuo/types/contextProps";

const FlavourFlowContext = createContext<FlavourFlowContextType>({
  meals: [],
  setMeals: () => {},
  currentPair: [],
  setCurrentPair: () => {},
  isAnimating: false,
  setIsAnimating: () => {},
  handleChoice: () => {},
  clickedMeals: new Set(),
});

export const FlavourFlowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [meals, setMeals] = useState<FlavourFlowMeal[]>(
    createDataForRanking(dataset),
  );
  const [currentPair, setCurrentPair] = useState<FlavourFlowMeal[]>([]);
  const [clickedMeals, setClickedMeals] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  const pairs: FlavourFlowMeal[][] = findPairsByQuestionset(meals);

  //   useEffect(() => {
  //     // const initialMeals = createDataForRanking(dataset);
  //     // setMeals(initialMeals);

  //     if (pairs.length > 0) {
  //       // Initial pair
  //       drawNewPair(setCurrentPair, pairs, clickedMeals, setIsAnimating);
  //     }
  //   }, []);

  useEffect(() => {
    if (pairs.length > 0 && clickedMeals.size < meals.length) {
      drawNewPair(setCurrentPair, pairs, clickedMeals, setIsAnimating);
    } else {
      setCurrentPair([]);
    }
  }, [meals, clickedMeals]);

  const handleChoice = (winner: FlavourFlowMeal, loser: FlavourFlowMeal) => {
    const { newWinnerElo, newLoserElo } = calculateElo(
      winner,
      loser,
      probability,
    );

    // Update meals' ELOs
    setMeals((prevMeals) =>
      updateElo(prevMeals, winner, loser, newWinnerElo, newLoserElo),
    );

    setClickedMeals((prev) => new Set(prev).add(winner.id).add(loser.id));

    // Draw a new pair of meals
    drawNewPair(
      setCurrentPair,
      findPairsByQuestionset(meals),
      clickedMeals,
      setIsAnimating,
    );
  };

  return (
    <FlavourFlowContext.Provider
      value={{
        meals,
        setMeals,
        currentPair,
        setCurrentPair,
        isAnimating,
        setIsAnimating,
        handleChoice,
        clickedMeals,
      }}
    >
      {children}
    </FlavourFlowContext.Provider>
  );
};

export const useFlavourFlow = () => useContext(FlavourFlowContext);
