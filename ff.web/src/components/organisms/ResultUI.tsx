import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import { getWinners } from "@vuo/utils/FlavourFlowFunctions";
import { ResultUIProps } from "@vuo/types/organismProps";
import Page from "../templates/Page";

const ResultUI: React.FC<ResultUIProps> = ({ meals }) => {
  return (
    <Page>
      {getWinners(meals).map((meal: FlavourFlowMeal) => {
        return <div style={{ color: "black" }}>{meal.title}</div>;
      })}
    </Page>
  );
};

export default ResultUI;
