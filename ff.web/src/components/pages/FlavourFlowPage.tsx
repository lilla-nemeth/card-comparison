import { useEffect, useState } from "react";
import module from "@vuo/scss/components/pages/FlavourFlow.module.scss";
import Page from "../templates/Page";
import ChoiceUI from "../organisms/ChoiceUI";
import {
  drawNewPair,
  findPairsByQuestionset,
} from "@vuo/utils/FlavourFlowFunctions";
import Button from "../atoms/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useFlavourFlow } from "@vuo/context/FlavourFlowContext";

const FlavourFlowPage = () => {
  const { meals, currentPair, clickedMeals, setCurrentPair, pairs } =
    useFlavourFlow();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (pairs.length > 0 && clickedMeals.size < meals.length) {
      drawNewPair(setCurrentPair, pairs, clickedMeals);
    } else {
      setCurrentPair([]);
    }
  }, [meals, clickedMeals, location.pathname]);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      const pairs = findPairsByQuestionset(meals);
      if (pairs.length > 0) {
        drawNewPair(setCurrentPair, pairs, clickedMeals);
      }
    }
  }, [meals, clickedMeals, isFirstLoad]);

  const handleNavigate = () => {
    navigate("/flavour-flow/results", { state: { meals } });
  };

  return (
    <Page>
      <div className={module.flavourFlowContainer}>
        {currentPair.length ? (
          <ChoiceUI />
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
