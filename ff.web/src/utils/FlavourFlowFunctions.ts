import { Dispatch } from "react";
import { FlavourFlowDataset, Meal } from "@vuo/types/dataTypes";

const createDataForRanking = (dataset: FlavourFlowDataset) => {
  let flattened: any = [];

  // Iterate over the object values (which are arrays of questions)
  Object.values(dataset).forEach((questionSet: any) => {
    questionSet.forEach((question: any) => {
      // Iterate over each "choice" in the question object
      Object.values(question).forEach((choice: any) => {
        flattened.push({
          ...choice,
          id: Math.random().toString(36).substr(2, 9), // Generate random ID
          elo: 1200, // Starting ELO score
        });
      });
    });
  });

  return flattened;
};

// K = 32
const calculateElo = (
  winner: Meal,
  loser: Meal,
  K: number,
): { newWinnerElo: number; newLoserElo: number } => {
  const expectedScoreWinner =
    1 / (1 + Math.pow(10, (loser.elo - winner.elo) / 400));
  const expectedScoreLoser =
    1 / (1 + Math.pow(10, (winner.elo - loser.elo) / 400));

  const newWinnerElo = winner.elo + K * (1 - expectedScoreWinner);
  const newLoserElo = loser.elo + K * (0 - expectedScoreLoser);

  return {
    newWinnerElo: Math.round(newWinnerElo),
    newLoserElo: Math.round(newLoserElo),
  };
};

// Update meals' ELOs
const updateElo = (
  prevMeals: Meal[],
  winner: Meal,
  loser: Meal,
  newWinnerElo: number,
  newLoserElo: number,
) => {
  return prevMeals.map((meal) => {
    if (meal.id === winner.id) {
      return { ...meal, elo: newWinnerElo };
    } else if (meal.id === loser.id) {
      return { ...meal, elo: newLoserElo };
    } else {
      return meal;
    }
  });
};

const drawNewPair = (
  stateSetter: Dispatch<React.SetStateAction<Meal[]>>,
  meals: Meal[],
): void => {
  const shuffledMeals = [...meals].sort(() => Math.random() - 0.5);

  // setCurrentPair
  stateSetter([shuffledMeals[0], shuffledMeals[1]]);
};

export { calculateElo, updateElo, createDataForRanking, drawNewPair };
