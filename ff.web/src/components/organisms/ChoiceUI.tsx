import module from "@vuo/scss/components/organisms/ChoiceUI.module.scss";
import { useState } from "react";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import Page from "../templates/Page";
import { ChoiceUIProps } from "@vuo/types/organismProps";
import HeartIcon from "../atoms/HeartIcon";

const ChoiceUI = ({ meals, handleChoice }: ChoiceUIProps) => {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const handleCardClick = (winner: FlavourFlowMeal, loser: FlavourFlowMeal) => {
    setSelectedMeal(winner.id);
    handleChoice(winner, loser);
    setSelectedMeal(null);
  };

  const containerClass =
    meals?.length > 2 ? module.scrollableContainer : module.staticContainer;

  return (
    <Page>
      <div className={containerClass}>
        {meals?.map((meal: FlavourFlowMeal) => {
          const isSelected = selectedMeal === meal.id;
          return (
            <>
              <div
                key={meal.id}
                onClick={() => {
                  handleCardClick(meal, meals.find((m) => m.id !== meal.id)!);
                }}
                className={module.card}
              >
                <div className={module.cardTitle}>
                  <p>{meal.title}</p>
                </div>
                {isSelected && (
                  <>
                    <div className={module.cardButtonActive}>
                      <HeartIcon className={module.cardButtonIconActive} />
                    </div>
                    <div className={module.cardSelectedTextActive}>chosen!</div>
                    <div className={module.cardSelectedOverlayActive}></div>
                  </>
                )}
                <div className={module.cardButton}>
                  <HeartIcon className={module.cardButtonIcon} />
                </div>
                <img
                  src={meal.image}
                  alt={meal.title}
                  className={module.cardImage}
                />
              </div>
              <div className={module.cardDeckContainer}>
                {meals.length > 1 && <div className={module.cardDeck}></div>}
              </div>
            </>
          );
        })}
      </div>
    </Page>
  );
};

export default ChoiceUI;
