import module from "@vuo/scss/components/organisms/ChoiceUI.module.scss";
import { useState } from "react";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import Page from "../templates/Page";
import { ChoiceUIProps } from "@vuo/types/organismProps";
import Card from "@vuo/components/atoms/Card";

const ChoiceUI = ({ meals, handleChoice }: ChoiceUIProps) => {
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [unselectedMealId, setUnselectedMealId] = useState<string | null>(null);

  const handleCardClick = (
    meals: FlavourFlowMeal[],
    winnerMeal: FlavourFlowMeal,
  ) => {
    const loser = meals.find((m) => m.id !== winner.id) as FlavourFlowMeal;
    const winner = meals.find((m) => m.id === winner.id) as FlavourFlowMeal;

    if (loser) {
      setUnselectedMealId(loser.id);
      setSelectedMealId(winner.id);
      handleChoice(winnerMeal, loser);
    }

    setTimeout(() => {
      setSelectedMealId(null);
      setUnselectedMealId(null);
    }, 300);
  };

  const containerClass =
    meals?.length > 2 ? module.scrollableContainer : module.staticContainer;

  return (
    <Page>
      <div className={containerClass}>
        {meals?.map((meal: FlavourFlowMeal) => {
          const isSelected = selectedMealId && selectedMealId === meal.id;
          const isLoser = selectedMealId && selectedMealId !== meal.id;
          return (
            <Card
              key={meal.id}
              meals={meals}
              meal={meal}
              onClick={() => {
                handleCardClick(meals, meal);
              }}
              isSelected={isSelected}
              selectedMealId={selectedMealId}
              isLoser={isLoser}
              isActive={selectedMealId === meal.id}
              // animate={{
              //   y: isSelected ? -300 : isLoser ? 300 : 0,
              // }}
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
