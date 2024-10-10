import Page from "../templates/Page";
import module from "@vuo/scss/components/pages/FlavourFlow.module.scss";
import ResultUI from "../organisms/ResultUI";
import { useFlavourFlow } from "@vuo/context/FlavourFlowContext";

const FlavourFlowResultPage = () => {
  const { meals } = useFlavourFlow();

  const sortedMeals = meals.slice().sort((a, b) => b.elo - a.elo);

  return (
    <Page>
      <div className={module.flavourFlowContainer}>
        <div className={module.resultContainer}>
          <ResultUI meals={sortedMeals} />
        </div>
      </div>
    </Page>
  );
};

export default FlavourFlowResultPage;
