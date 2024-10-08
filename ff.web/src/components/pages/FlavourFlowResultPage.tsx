import Page from "../templates/Page";
import module from "@vuo/scss/components/pages/FlavourFlow.module.scss";
import { useLocation } from "react-router-dom";
import { getWinners } from "@vuo/utils/FlavourFlowFunctions";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";

export default function FlavourFlowResultPage() {
  const location = useLocation();
  const { meals } = location.state || {};

  return (
    <Page>
      <div className={module.flavourFlowContainer}>
        {getWinners(meals).map((meal: FlavourFlowMeal) => {
          return <div style={{ color: "black" }}>{meal.title}</div>;
        })}
      </div>
    </Page>
  );
}
