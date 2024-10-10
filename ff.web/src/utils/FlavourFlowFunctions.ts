import { Dispatch } from "react";
import { FlavourFlowDataset, FlavourFlowMeal } from "@vuo/types/dataTypes";
import { v4 as uuidv4 } from "uuid";

// Function that updates id and returns the meals
const createDataForRanking = (
  dataset: FlavourFlowDataset,
): FlavourFlowMeal[] => {
  const meals = Object.values(dataset).flatMap((questionSet) =>
    questionSet.flatMap((question) =>
      Object.values(question).map((choice) => ({
        ...choice,
        id: uuidv4(),
      })),
    ),
  );

  return meals;
};

const probability = (
  rating1: FlavourFlowMeal["elo"],
  rating2: FlavourFlowMeal["elo"],
): number => {
  return 1 / (1 + Math.pow(10, (rating1 - rating2) / 400));
};

const calculateElo = (
  winner: FlavourFlowMeal,
  loser: FlavourFlowMeal,
  probability: (
    rating1: FlavourFlowMeal["elo"],
    rating2: FlavourFlowMeal["elo"],
  ) => number,
): { newWinnerElo: number; newLoserElo: number } => {
  const K = 32;
  const winnerElo = winner.elo;
  const loserElo = loser.elo;

  const expectedScoreWinner = probability(loserElo, winnerElo);
  const expectedScoreLoser = probability(winnerElo, loserElo);

  let newWinnerElo = winnerElo + K * (1 - expectedScoreWinner);
  let newLoserElo = loserElo + K * (0 - expectedScoreLoser);

  return {
    newWinnerElo: Math.round(newWinnerElo),
    newLoserElo: Math.round(newLoserElo),
  };
};

// Update meals' ELOs
const updateElo = (
  prevMeals: FlavourFlowMeal[],
  winner: FlavourFlowMeal,
  loser: FlavourFlowMeal,
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

const findPairsByQuestionset = (
  meals: FlavourFlowMeal[],
): FlavourFlowMeal[][] => {
  const groupedMeals: Record<string, FlavourFlowMeal[]> = {};

  meals.forEach((meal) => {
    const questionset = meal.category as string;
    if (!groupedMeals[questionset]) {
      groupedMeals[questionset] = [];
    }
    groupedMeals[questionset].push(meal);
  });

  const pairs: FlavourFlowMeal[][] = [];

  Object.values(groupedMeals).forEach((mealsInQuestionset) => {
    while (mealsInQuestionset.length > 1) {
      const randomIndex1 = Math.floor(
        Math.random() * mealsInQuestionset.length,
      );
      const meal1 = mealsInQuestionset[randomIndex1];

      mealsInQuestionset.splice(randomIndex1, 1);

      const randomIndex2 = Math.floor(
        Math.random() * mealsInQuestionset.length,
      );
      const meal2 = mealsInQuestionset[randomIndex2];

      mealsInQuestionset.splice(randomIndex2, 1);

      pairs.push([meal1, meal2]);
    }
  });

  return pairs;
};

const drawNewPair = (
  setCurrentPair: Dispatch<React.SetStateAction<FlavourFlowMeal[]>>,
  pairs: FlavourFlowMeal[][],
  clickedMeals: Set<string>,
) => {
  const availablePairs = pairs.filter(
    (pair) => !clickedMeals.has(pair[0].id) && !clickedMeals.has(pair[1].id),
  );

  if (availablePairs.length > 0) {
    const randomIndex = Math.floor(Math.random() * availablePairs.length);

    setCurrentPair(availablePairs[randomIndex]);
  } else {
    setCurrentPair([]);
  }
};

const getWinners = (meals: FlavourFlowMeal[]) => {
  return meals.filter((meal) => meal.elo > 1200);
};

export {
  calculateElo,
  probability,
  updateElo,
  createDataForRanking,
  findPairsByQuestionset,
  drawNewPair,
  getWinners,
};
