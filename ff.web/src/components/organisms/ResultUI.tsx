import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import { getWinners } from "@vuo/utils/FlavourFlowFunctions";
import { ResultUIProps } from "@vuo/types/organismProps";
import Page from "../templates/Page";
import module from "@vuo/scss/components/organisms/ResultUI.module.scss";

const ResultUI: React.FC<ResultUIProps> = ({ meals }) => {
  const containerClass =
    getWinners(meals).length > 2
      ? module.scrollableContainer
      : module.staticContainer;

  return (
    <Page>
      <div className={containerClass}>
        {getWinners(meals).map((meal: FlavourFlowMeal) => {
          return (
            <div key={meal.id} style={{ color: "black" }}>
              {meal.title}
            </div>
          );
        })}
      </div>
    </Page>
  );
};

export default ResultUI;
