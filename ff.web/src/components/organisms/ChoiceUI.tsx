import { useState } from "react";
import { Meal } from "../pages/FlavourFlowPage";
import module from "@vuo/scss/components/organisms/ChoiceUI.module.scss";
import Page from "../templates/Page";
import { ChoiceUIProps } from "@vuo/types/organismProps";

const ChoiceUI = ({ meals, handleChoice }: ChoiceUIProps) => {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const handleCardClick = (winner: Meal, loser: Meal) => {
    setSelectedMeal(winner.id);
    handleChoice(winner, loser);
    setSelectedMeal(null);
  };

  const containerClass =
    meals?.length > 2 ? module.scrollableContainer : module.staticContainer;

  return (
    <Page>
      <div className={containerClass}>
        {meals?.map((meal: Meal) => {
          const isSelected = selectedMeal === meal.id;
          return (
            <div
              key={meal.id}
              onClick={() => {
                handleCardClick(meal, meals.find((m) => m.id !== meal.id)!);
              }}
              className={`${module.card}`}
            >
              {isSelected && <h4 className={module.overlay}> chosen!</h4>}
              <div className={module.cardOverlay}></div>
              <img src={meal.image} alt={meal.title} />
              <p>{meal.title}</p>
            </div>
          );
        })}
      </div>
    </Page>
  );
};

export default ChoiceUI;
