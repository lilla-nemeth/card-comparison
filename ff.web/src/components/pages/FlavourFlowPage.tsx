import React, { useEffect, useState } from 'react'

import CauliflowerImage from "../../../public/images/CauliflowerRice.webp";
import Day1BaconImage from "../../../public/images/1.webp";
import Day2KetoImage from "../../../public/images/2.webp";
import Day3ChickenImage from "../../../public/images/3.webp";
import Day4SalmonImage from "../../../public/images/4.webp";
import Day5MexicanImage from "../../../public/images/5.webp";
import Day6StuffedImage from "../../../public/images/6.webp";
import Day7BoneImage from "../../../public/images/7.webp";
import ChoiceUI from '../organisms/ChoiceUI';
import Page from '../templates/Page';

// Dataset
const dataset = {
  questionset: [
    {
      choice: { title: "Sweet", image: CauliflowerImage },
      choice1: { title: "Savory", image: Day1BaconImage },
    },
  ],
  questionset1: [
    {
      choice2: { title: "Quick and easy", image: Day2KetoImage },
      choice3: { title: "Requires more time", image: Day3ChickenImage },
    },
  ],
  questionset2: [
    {
      choice4: { title: "Traditional breakfast", image: Day4SalmonImage },
      choice5: { title: "Unique twist", image: Day5MexicanImage },
    },
  ],
  questionset3: [
    {
      choice6: { title: "Simple ingredients", image: Day6StuffedImage },
      choice7: { title: "Variety of ingredients", image: Day7BoneImage },
    },
  ],
};

export type Meal = {
    id: string;
    title: string;
    elo: number;
    image: string;
  };

const K = 32;  

const calculateElo = (winner: Meal, loser: Meal): { newWinnerElo: number, newLoserElo: number } => {

  const expectedScoreWinner = 1 / (1 + Math.pow(10, (loser.elo - winner.elo) / 400));
  const expectedScoreLoser = 1 / (1 + Math.pow(10, (winner.elo - loser.elo) / 400));

  const newWinnerElo = winner.elo + K * (1 - expectedScoreWinner);
  const newLoserElo = loser.elo + K * (0 - expectedScoreLoser);

  return {
    newWinnerElo: Math.round(newWinnerElo),
    newLoserElo: Math.round(newLoserElo),
  };
};

export default function FlavourFlowPage() {
  const createDataForRanking = (dataset) => {
		let flattened = [];
	
		// Iterate over the object values (which are arrays of questions)
		Object.values(dataset).forEach(questionSet => {
			questionSet.forEach(question => {
				// Iterate over each "choice" in the question object
				Object.values(question).forEach(choice => {
					flattened.push({
						...choice,
						id: Math.random().toString(36).substr(2, 9),  // Generate random ID
						elo: 1200,  // Starting ELO score
					});
				});
			});
		});
	
		return flattened;
	};

  const [meals, setMeals] = useState<Meal[]>(createDataForRanking(dataset));
  const [currentPair, setCurrentPair] = useState<Meal[]>([]);

	useEffect(() => {
		drawNewPair();
	}, []);

	const drawNewPair = () => {
		const shuffledMeals = [...meals].sort(() => Math.random() - 0.5);
    
		setCurrentPair([shuffledMeals[0], shuffledMeals[1]]);
	};

	const handleChoice = (winner: Meal, loser: Meal) => {
  const { newWinnerElo, newLoserElo } = calculateElo(winner, loser);

  // Update meals' ELOs
  setMeals((prevMeals) =>
    prevMeals.map((meal) =>
      meal.id === winner.id ? { ...meal, elo: newWinnerElo } :
      meal.id === loser.id ? { ...meal, elo: newLoserElo } : meal
    )
  );

  // Draw a new pair of meals
  	drawNewPair();
	};

  return (
		<Page>
      <ChoiceUI
				meals={currentPair}
				handleChoice={handleChoice}
      />
		</Page>
  )
}
