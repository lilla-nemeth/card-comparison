import { useEffect, useState } from "react";
import Page from "../templates/Page";
import { ChoiceUIProps } from "@vuo/types/organismProps";

import { motion, AnimatePresence } from "framer-motion";
import Card from "@vuo/components/atoms/Card";
import CardActionBtn from "../atoms/CardActionBtn";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import module from "@vuo/scss/components/organisms/ChoiceUI.module.scss";
import {
  IsDragOffBoundary,
  CardSwipeDirection,
} from "@vuo/types/moleculeProps";

const ChoiceUI = ({ meals, setMeals, handleChoice }: ChoiceUIProps) => {
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

  // swiping and dragging cards
  const [direction, setDirection] = useState<CardSwipeDirection | "">("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOffBoundary, setIsDragOffBoundary] =
    useState<IsDragOffBoundary>(null);

  const cardVariants = {
    current: { opacity: 1, scale: 1 },
    exit: {
      opacity: 0,
      y: direction === "up" ? -300 : 300,
      transition: { duration: 0.7 },
    }, // Slower exit animation
  };

  const handleCardClick = (
    meals: FlavourFlowMeal[],
    winnerMeal: FlavourFlowMeal,
  ) => {
    const loser = meals.find((m) => m.id !== winnerMeal.id) as FlavourFlowMeal;

    if (loser) {
      setSelectedMealId(winnerMeal.id);
      handleChoice(winnerMeal, loser);
    }

    setTimeout(() => {
      setSelectedMealId(null);
    }, 300);

    return winnerMeal.id;
  };

  const handleDirectionChange = (newDirection: "up" | "down") => {
    setDirection(newDirection);

    setMeals((prev) => prev.slice(1));

    setTimeout(() => {
      setDirection("");
    }, 700);
  };

  const containerClass =
    meals?.length > 2 ? module.scrollableContainer : module.staticContainer;

  return (
    <Page>
      <div className={containerClass}>
        <AnimatePresence>
          {meals.map((meal: FlavourFlowMeal, index: number) => {
            const isSelected = meal.id === selectedMealId;
            return (
              <motion.div
                key={meal.id}
                variants={cardVariants}
                initial="current"
                exit="exit"
              >
                <Card
                  id={meal.id}
                  meal={meal}
                  onClick={() => {
                    handleCardClick(meals, meal);
                    handleDirectionChange("up");
                  }}
                  index={index}
                  isSelected={isSelected}
                  drag={"y"}
                  setIsDragging={setIsDragging}
                  setDirection={handleDirectionChange}
                  setIsDragOffBoundary={setIsDragOffBoundary}
                  // handleDirectionChange={handleDirectionChange}
                  cardContainerClass={module.cardContainer}
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
                  style={{
                    position: "absolute",
                    left: index === 0 ? "calc(0% + 10%)" : "50%",
                    transform:
                      index === 0 ? "translateX(0)" : "translateX(-10%)",
                    zIndex: 500,
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Page>
  );
};

export default ChoiceUI;

{
  /* <div>
          <CardActionBtn
            direction="up"
            onClick={() => handleDirectionChange("up")}
          />
          <CardActionBtn
            direction="down"
            onClick={() => handleDirectionChange("down")}
          />
        </div> */
}
