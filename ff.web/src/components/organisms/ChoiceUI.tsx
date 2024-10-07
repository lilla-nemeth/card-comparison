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
  const [unselectedMealId, setUnselectedMealId] = useState<string | null>(null);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isLoser, setIsLoser] = useState<boolean>(false);

  // swiping and dragging cards
  const [direction, setDirection] = useState<CardSwipeDirection | "">("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOffBoundary, setIsDragOffBoundary] =
    useState<IsDragOffBoundary>(null);

  const cardVariants = {
    current: { opacity: 1, scale: 1 },
    exit: { opacity: 0, y: direction === "up" ? -300 : 300 },
  };

  const handleCardClick = (
    meals: FlavourFlowMeal[],
    winnerMeal: FlavourFlowMeal,
  ) => {
    const loser = meals.find((m) => m.id !== winnerMeal.id) as FlavourFlowMeal;

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

  const handleDirectionChange = (newDirection: "up" | "down") => {
    setDirection(newDirection);
    setMeals((prev) => prev.slice(1));

    setTimeout(() => {
      setDirection("");
    }, 100);
  };

  useEffect(() => {
    setIsSelected(selectedMealId !== null);
  }, [selectedMealId]);

  // const containerClass =
  //   meals?.length > 2 ? module.scrollableContainer : module.staticContainer;

  return (
    <Page>
      <div className={module.staticContainer}>
        <AnimatePresence>
          {meals.map((meal: FlavourFlowMeal) => {
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
                    handleDirectionChange("up");
                    handleCardClick(meals, meal);
                    setIsSelected(selectedMealId === meal.id);
                    setIsLoser(selectedMealId !== meal.id);
                  }}
                  isSelected={isSelected}
                  drag={"y"}
                  setIsDragging={setIsDragging}
                  setIsDragOffBoundary={setIsDragOffBoundary}
                  setDirection={handleDirectionChange}
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
