import module from "@vuo/scss/components/organisms/ChoiceUI.module.scss";
import { useState } from "react";
import { Meal } from "../pages/FlavourFlowPage";
import Page from "../templates/Page";
import { ChoiceUIProps } from "@vuo/types/organismProps";
import HeartIcon from "../atoms/HeartIcon";

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
                <div className={module.cardButton}>
                  <HeartIcon className={module.cardButtonIcon} />
                </div>
                <img
                  src={meal.image}
                  alt={meal.title}
                  className={module.cardImage}
                />
                {/* {isSelected && ( */}
                <div className={module.cardSelectedOverlay}>
                  <div className={module.cardSelectedText}> chosen!</div>
                </div>
                {/* )} */}
              </div>
              <div>
                {meals.length > 1 && <div className={module.cardStack}></div>}
              </div>
            </>
          );
        })}
      </div>
    </Page>
  );
};

export default ChoiceUI;
