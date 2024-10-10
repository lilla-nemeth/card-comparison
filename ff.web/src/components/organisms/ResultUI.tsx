import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import { getWinnersByAttributes } from "@vuo/utils/FlavourFlowFunctions";
import { ResultUIProps } from "@vuo/types/organismProps";
import resultUIModules from "@vuo/scss/components/organisms/ResultUI.module.scss";
import Card from "../atoms/Card";
import cardModules from "@vuo/scss/components/organisms/ChoiceUI.module.scss";
import { useFlavourFlow } from "@vuo/context/FlavourFlowContext";

const ResultUI: React.FC<ResultUIProps> = () => {
  const { meals } = useFlavourFlow();
  const winnerMeals = getWinnersByAttributes(meals);
  const containerClass =
    winnerMeals.length > 2
      ? resultUIModules.scrollableContainer
      : resultUIModules.staticContainer;

  return (
    <div className={containerClass}>
      <div className={resultUIModules.logoContainer}>
        <div className={resultUIModules.logo}>Flavour Flow</div>
      </div>
      <div className={resultUIModules.cardContainer}>
        {winnerMeals.map((meal: FlavourFlowMeal) => {
          return (
            <div className={resultUIModules.cardWrapper} key={meal.id}>
              <Card
                meal={meal}
                cardClass={resultUIModules.card}
                titleClass={cardModules.cardTitle}
                btnClass={cardModules.cardButton}
                btnIconClass={cardModules.cardButtonIcon}
                textClass={cardModules.cardText}
                imageClass={cardModules.cardImage}
                deckContainerClass={resultUIModules.cardDeckContainer}
                deckClass={resultUIModules.cardDeck}
                meals={winnerMeals}
              />
            </div>
          );
        })}
        {winnerMeals.length % 2 !== 0 && (
          <div className={resultUIModules.cardWrapper}></div>
        )}
      </div>
    </div>
  );
};

export default ResultUI;
