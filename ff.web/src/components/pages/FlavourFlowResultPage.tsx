import Page from "../templates/Page";
import { useLocation } from "react-router-dom";
import { getWinners } from "@vuo/utils/FlavourFlowFunctions";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";

export default function FlavourFlowResultPage() {
  const location = useLocation();
  const { meals } = location.state || {};

  return (
    <Page>
      {getWinners(meals).map((meal: FlavourFlowMeal) => {
        return <div>{meal.title}</div>;
      })}
    </Page>
  );
}
