import Page from "../templates/Page";
import module from "@vuo/scss/components/pages/FlavourFlow.module.scss";
import ResultUI from "../organisms/ResultUI";
import { useFlavourFlow } from "@vuo/context/FlavourFlowContext";
import Button from "../atoms/Button";
import { useNavigate } from "react-router-dom";

const FlavourFlowResultPage = () => {
  const { meals } = useFlavourFlow();
  const navigate = useNavigate();

  const sortedMeals = meals.slice().sort((a, b) => b.elo - a.elo);

  const handleNavigateBack = () => {
    setTimeout(() => {
      navigate("/flavour-flow", { state: { resetCurrentPair: true } });
      // Not the best solution but it works...
      window.location.reload();
    }, 200);
  };

  return (
    <Page>
      <div className={module.flavourFlowContainer}>
        <div className={module.resultContainer}>
          <ResultUI meals={sortedMeals} />
          <div className={module.resultButtonContainer}>
            <Button
              variant="large"
              color="secondary"
              onClick={handleNavigateBack}
            >
              Back to Flavour Flow
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default FlavourFlowResultPage;
function navigate(
  arg0: string,
  arg1: { state: { resetCurrentPair: boolean } },
) {
  throw new Error("Function not implemented.");
}
