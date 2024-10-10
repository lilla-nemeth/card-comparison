import module from "@vuo/scss/components/pages/FlavourFlow.module.scss";
import Page from "../templates/Page";
import ChoiceUI from "../organisms/ChoiceUI";
import Button from "../atoms/Button";
import { useNavigate } from "react-router-dom";
import { useFlavourFlow } from "@vuo/context/FlavourFlowContext";

const FlavourFlowPage = () => {
  const navigate = useNavigate();

  const { currentPair } = useFlavourFlow();

  const handleNavigate = () => {
    navigate("/flavour-flow/results");
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
