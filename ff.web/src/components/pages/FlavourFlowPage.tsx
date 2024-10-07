import { useEffect, useState } from "react";
import Page from "../templates/Page";
import { dataset } from "@vuo/utils/FlavourFlowData";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import ChoiceUI from "../organisms/ChoiceUI";
import {
  probability,
  calculateElo,
  createDataForRanking,
  drawNewPair,
  updateElo,
  findPairsByQuestionset,
} from "@vuo/utils/FlavourFlowFunctions";
import Button from "../atoms/Button";
import { useNavigate } from "react-router-dom";

export default function FlavourFlowPage() {
  const [meals, setMeals] = useState<FlavourFlowMeal[]>(
    createDataForRanking(dataset),
  );
  const [currentPair, setCurrentPair] = useState<FlavourFlowMeal[]>([]);
  const [clickedMeals, setClickedMeals] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const pairs = findPairsByQuestionset(meals);
    if (pairs.length > 0) {
      // Initial pair
      drawNewPair(setCurrentPair, pairs, clickedMeals);
    }
  }, [meals, clickedMeals]);

  const handleNavigate = () => {
    navigate("/flavour-flow/results", { state: { meals } });
  };

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
    drawNewPair(setCurrentPair, findPairsByQuestionset(meals), clickedMeals);
  };

  return (
    <Page>
      <ChoiceUI
        meals={currentPair}
        setMeals={setMeals}
        handleChoice={handleChoice}
      />
      {currentPair.length === 0 && (
        <Button onClick={handleNavigate}>See the Results</Button>
      )}
    </Page>
  );
}
