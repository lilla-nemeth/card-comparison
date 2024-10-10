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

const findPairsByCategories = (
  meals: FlavourFlowMeal[],
): FlavourFlowMeal[][] => {
  const groupedMeals: Record<string, FlavourFlowMeal[]> = {};

  const pairs: FlavourFlowMeal[][] = [];

  meals.forEach((meal) => {
    const category = meal.category as string;

    if (!groupedMeals[category]) {
      groupedMeals[category] = [];
    }
    groupedMeals[category].push(meal);
  });

  Object.values(groupedMeals).forEach((meals) => {
    while (meals.length > 1) {
      const randomIndex1 = Math.floor(Math.random() * meals.length);
      const meal1 = meals.splice(randomIndex1, 1)[0];

      const randomIndex2 = Math.floor(Math.random() * meals.length);
      const meal2 = meals.splice(randomIndex2, 1)[0];

      pairs.push([meal1, meal2]);
    }

    if (meals.length === 1) {
      const leftoverMeal = meals[0];

      pairs.push([leftoverMeal]);
    }
  });

  return pairs;
};

const drawNewPair = (pairs: FlavourFlowMeal[][], clickedMeals: Set<string>) => {
  if (!pairs) return [];

  const availablePairs = pairs.filter(
    (pair) => !clickedMeals.has(pair[0].id) && !clickedMeals.has(pair[1].id),
  );

  if (availablePairs.length > 0) {
    const randomIndex = Math.floor(Math.random() * availablePairs.length);

    return availablePairs[randomIndex];
  }

  return [];
};

const getWinnersByAttributes = (meals: FlavourFlowMeal[]) => {
  const winners = meals.filter((meal) => meal.elo > 1200);
  return winners;
};

const findRandomPairs = (meals: FlavourFlowMeal[]): FlavourFlowMeal[][] => {
  const pairs: FlavourFlowMeal[][] = [];
  let shuffledMeals = [...meals];

  shuffledMeals = shuffledMeals.sort(() => Math.random() - 0.5);

  while (shuffledMeals.length > 1) {
    const meal1 = shuffledMeals.shift()!;
    const meal2 = shuffledMeals.shift()!;
    pairs.push([meal1, meal2]);
  }

  if (shuffledMeals.length === 1) {
    pairs.push([shuffledMeals[0]]);
  }

  return pairs;
};

export {
  calculateElo,
  probability,
  updateElo,
  createDataForRanking,
  findPairsByCategories,
  drawNewPair,
  getWinnersByAttributes,
  findRandomPairs,
};
