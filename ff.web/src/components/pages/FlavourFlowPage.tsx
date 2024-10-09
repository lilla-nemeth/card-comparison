import { useEffect, useState } from "react";
import module from "@vuo/scss/components/pages/FlavourFlow.module.scss";
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
import { useFlavourFlow } from "@vuo/context/FlavourFlowContext";

const FlavourFlowPage = () => {
  const {
    meals,
    currentPair,
    clickedMeals,
    // setMeals,
    setCurrentPair,
    // setClickedMeals,
    // isAnimating,
    setIsAnimating,
    // handleChoice,
  } = useFlavourFlow();

  // const [meals, setMeals] = useState<FlavourFlowMeal[]>(
  //   createDataForRanking(dataset),
  // );
  // const [currentPair, setCurrentPair] = useState<FlavourFlowMeal[]>([]);
  // const [clickedMeals, setClickedMeals] = useState<Set<string>>(new Set());
  // const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  // const pairs: FlavourFlowMeal[][] = findPairsByQuestionset(meals);

  // useEffect(() => {
  //   if (pairs.length > 0) {
  //     // Initial pair
  //     drawNewPair(setCurrentPair, pairs, clickedMeals, setIsAnimating);
  //   }
  // }, [pairs, clickedMeals]);

  useEffect(() => {
    if (meals.length && currentPair.length === 0) {
      const pairs = findPairsByQuestionset(meals); // Regenerate pairs
      if (pairs.length > 0) {
        drawNewPair(setCurrentPair, pairs, clickedMeals, setIsAnimating);
      }
    }
  }, [currentPair, meals, clickedMeals]);

  const handleNavigate = () => {
    navigate("/flavour-flow/results", { state: { meals } });
  };

  // const handleChoice = (winner: FlavourFlowMeal, loser: FlavourFlowMeal) => {
  //   const { newWinnerElo, newLoserElo } = calculateElo(
  //     winner,
  //     loser,
  //     probability,
  //   );

  //   // Update meals' ELOs
  //   setMeals((prevMeals) =>
  //     updateElo(prevMeals, winner, loser, newWinnerElo, newLoserElo),
  //   );

  //   setClickedMeals((prev) => new Set(prev).add(winner.id).add(loser.id));

  //   // Draw a new pair of meals
  //   drawNewPair(
  //     setCurrentPair,
  //     findPairsByQuestionset(meals),
  //     clickedMeals,
  //     setIsAnimating,
  //   );
  // };

  return (
    <Page>
      <div className={module.flavourFlowContainer}>
        {currentPair.length ? (
          <ChoiceUI
          // meals={currentPair}
          // isAnimating={isAnimating}
          // setIsAnimating={setIsAnimating}
          // handleChoice={handleChoice}
          />
        ) : (
          <div className={module.resultButtonContainer}>
            <Button color="secondary" onClick={handleNavigate}>
              See the Results
            </Button>
          </div>
        )}
      </div>
    </Page>
  );
};

export default FlavourFlowPage;
