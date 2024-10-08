import Page from "../templates/Page";
import module from "@vuo/scss/components/pages/FlavourFlow.module.scss";
import { useLocation } from "react-router-dom";
import ResultUI from "../organisms/ResultUI";

const FlavourFlowResultPage = () => {
  const location = useLocation();
  const { meals } = location.state || {};

  return (
    <Page>
      <div className={module.flavourFlowContainer}>
        <div className={module.resultContainer}>
          <ResultUI meals={meals} />
        </div>
      </div>
    </Page>
  );
};

export default FlavourFlowResultPage;
