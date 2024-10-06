import module from "@vuo/scss/components/organisms/ChoiceUI.module.scss";
import { useEffect, useState } from "react";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import Page from "../templates/Page";
import { ChoiceUIProps } from "@vuo/types/organismProps";
import Card from "@vuo/components/atoms/Card";

const ChoiceUI = ({ meals, handleChoice }: ChoiceUIProps) => {
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [unselectedMealId, setUnselectedMealId] = useState<string | null>(null);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isLoser, setIsLoser] = useState<boolean>(false);

  const handleCardClick = (
    meals: FlavourFlowMeal[],
    winnerMeal: FlavourFlowMeal,
  ) => {
    const loser = meals.find((m) => m.id !== winnerMeal.id) as FlavourFlowMeal;
    // const winner = meals.find((m) => m.id === winner.id) as FlavourFlowMeal;

    if (loser) {
      setUnselectedMealId(loser.id);
      setSelectedMealId(winnerMeal.id);

      handleChoice(winnerMeal, loser);
    }

    setTimeout(() => {
      setSelectedMealId(null);
      setUnselectedMealId(null);
    }, 300);
  };

  useEffect(() => {
    // Log or handle actions here based on the most up-to-date selectedMealId
    console.log("Selected meal ID changed:", selectedMealId);
    setIsSelected(selectedMealId !== null);
    // setIsLoser(selectedMealId !== null);
  }, [selectedMealId]);

  const containerClass =
    meals?.length > 2 ? module.scrollableContainer : module.staticContainer;

  return (
    <Page>
      <div className={containerClass}>
        {meals?.map((meal: FlavourFlowMeal) => {
          return (
            <Card
              key={meal.id}
              meals={meals}
              meal={meal}
              onClick={() => {
                handleCardClick(meals, meal);
                // if (selectedMealId !== null) {
                // }
                setIsSelected(selectedMealId === meal.id);
                setIsLoser(selectedMealId !== meal.id);
              }}
              isSelected={isSelected}
              selectedMealId={selectedMealId}
              isLoser={isLoser}
              setIsSelected={setIsSelected}
              setIsLoser={setIsLoser}
              // isActive={selectedMealId === meal.id}
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
