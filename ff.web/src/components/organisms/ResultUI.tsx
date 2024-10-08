import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import { getWinners } from "@vuo/utils/FlavourFlowFunctions";
import { ResultUIProps } from "@vuo/types/organismProps";
import Page from "../templates/Page";
import resultUIModules from "@vuo/scss/components/organisms/ResultUI.module.scss";
import Card from "../atoms/Card";
import cardModules from "@vuo/scss/components/organisms/ChoiceUI.module.scss";

const ResultUI: React.FC<ResultUIProps> = ({ meals }) => {
  const containerClass =
    getWinners(meals).length > 2
      ? resultUIModules.scrollableContainer
      : resultUIModules.staticContainer;

  return (
    // <Page>
    <div className={containerClass}>
      {getWinners(meals).map((meal: FlavourFlowMeal) => {
        return (
          <Card
            id={`card ${meal.id}`}
            meal={meal}
            cardClass={resultUIModules.card}
            titleClass={cardModules.cardTitle}
            btnClass={cardModules.cardButton}
            btnIconClass={cardModules.cardButtonIcon}
            imageClass={cardModules.cardImage}
            deckContainerClass={cardModules.cardDeckContainer}
            deckClass={cardModules.cardDeck}
            meals={getWinners(meals)}
          />
        );
      })}
    </div>
    // </Page>
  );
};

export default ResultUI;
