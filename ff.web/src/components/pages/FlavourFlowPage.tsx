import { useEffect, useState } from "react";
import Page from "../templates/Page";
import { dataset } from "@vuo/utils/FlavourFlowData";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import ChoiceUI from "../organisms/ChoiceUI";
import {
  calculateElo,
  createDataForRanking,
  drawNewPair,
  updateElo,
} from "@vuo/utils/FlavourFlowFunctions";

export default function FlavourFlowPage() {
  const [meals, setMeals] = useState<FlavourFlowMeal[]>(
    createDataForRanking(dataset),
  );
  const [currentPair, setCurrentPair] = useState<FlavourFlowMeal[]>([]);
  const K = 32;

  useEffect(() => {
    drawNewPair(setCurrentPair, meals);
  }, []);

  const handleChoice = (winner: FlavourFlowMeal, loser: FlavourFlowMeal) => {
    const { newWinnerElo, newLoserElo } = calculateElo(winner, loser, K);

    // Update meals' ELOs
    setMeals((prevMeals) =>
      updateElo(prevMeals, winner, loser, newWinnerElo, newLoserElo),
    );

    // Draw a new pair of meals
    drawNewPair(setCurrentPair, meals);
  };

  return (
    <Page>
      <ChoiceUI meals={currentPair} handleChoice={handleChoice} />
    </Page>
  );
}
