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

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentPair.length === 0) {
      drawNewPair(setCurrentPair, pairs, clickedMeals);
    }
  }, [currentPair, clickedMeals, pairs, setCurrentPair]);

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
