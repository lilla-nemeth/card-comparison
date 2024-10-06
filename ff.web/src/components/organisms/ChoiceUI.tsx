import module from "@vuo/scss/components/organisms/ChoiceUI.module.scss";
import { useState } from "react";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import Page from "../templates/Page";
import { ChoiceUIProps } from "@vuo/types/organismProps";
import Card from "@vuo/components/atoms/Card";

const ChoiceUI = ({ meals, handleChoice }: ChoiceUIProps) => {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [loserMeal, setLoserMeal] = useState<string | null>(null);

  const handleCardClick = (
    meals: FlavourFlowMeal[],
    winner: FlavourFlowMeal,
  ) => {
    const loser = meals.find((m) => m.id !== winner.id) as FlavourFlowMeal;

    if (loser) {
      setSelectedMeal(winner.id);
      setLoserMeal(loser.id);
      handleChoice(winner, loser);
    }

    setTimeout(() => {
      setSelectedMeal(null);
      setLoserMeal(null);
    }, 300);
  };

  const containerClass =
    meals?.length > 2 ? module.scrollableContainer : module.staticContainer;

  return (
    <Page>
      <div className={containerClass}>
        {meals?.map((meal: FlavourFlowMeal) => {
          const isSelected = selectedMeal === meal.id;
          const isLoser = selectedMeal && selectedMeal !== meal.id;
          return (
            <Card
              key={meal.id}
              meals={meals}
              meal={meal}
              onClick={() => {
                handleCardClick(meals, meal);
              }}
              isSelected={isSelected}
              selectedMeal={selectedMeal}
              isLoser={isLoser}
              animate={{
                y: isLoser ? 300 : isSelected ? -300 : 0,
              }}
              transition={{ type: "spring", stiffness: 300 }}
              cardClass={module.card}
              titleClass={module.cardTitle}
              btnActiveClass={module.cardButtonActive}
              btnIconActiveClass={module.cardButtonIconActive}
              textActiveClass={module.cardTextActive}
              overlayActiveClass={module.cardOverlayActive}
              btnClass={module.cardButton}
              btnIconClass={module.cardButtonIcon}
              imageClass={module.cardImage}
              deckContainerClass={module.cardDeckContainer}
              deckClass={module.cardDeck}
            />
          );
        })}
      </div>
    </Page>
  );
};

export default ChoiceUI;
