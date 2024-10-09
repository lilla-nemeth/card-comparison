import { useEffect, useState } from "react";
import Page from "../templates/Page";
import { ChoiceUIProps } from "@vuo/types/organismProps";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@vuo/components/atoms/Card";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import module from "@vuo/scss/components/organisms/ChoiceUI.module.scss";
import { CardSwipeDirection } from "@vuo/types/moleculeProps";

const ChoiceUI: React.FC<ChoiceUIProps> = ({
  meals,
  setMeals,
  handleChoice,
  isAnimating,
  setIsAnimating,
}) => {
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [direction, setDirection] = useState<CardSwipeDirection | "">("");
  // const [isSelected, setIsSelected] = useState<boolean>(false);

  const cardVariants = {
    current: { opacity: 1, scale: 1 },
    exit: (custom: { direction: string }) => ({
      opacity: 0,
      y: custom.direction === "up" ? -300 : 300,
      zIndex: 0,
      transition: {
        duration: 0.25,
        delay: 0.5,
      },
    }),
  };

  const handleSelectedCardClick = (id: FlavourFlowMeal["id"]) => {
    setSelectedMealId(id);
  };

  // const handleCardClick = (meals: FlavourFlowMeal[], meal: FlavourFlowMeal) => {
  //   setIsAnimating?.(true);
  //   setSelectedMealId(meal.id);
  //   const loser = meals.find((m) => m.id !== meal.id) as FlavourFlowMeal;
  //   handleChoice(meal, loser);

  //   setTimeout(() => {
  //     setIsAnimating?.(false);
  //     setSelectedMealId(null);
  //   }, 300);
  //   return meal.id;
  // };

  // const handleDirectionChange = (newDirection: "up" | "down") => {
  //   setDirection(newDirection);
  //   setMeals((prev) => prev.slice(1));

  //   setTimeout(() => {
  //     setDirection("");
  //   }, 300);
  // };

  // useEffect(() => {
  //   setIsSelected(selectedMealId !== null);
  // }, [selectedMealId]);

  return (
    <Page>
      <div className={module.staticContainer}>
        <div>
          <AnimatePresence>
            {!isAnimating &&
              meals.map((meal: FlavourFlowMeal, index: number) => {
                // const isSelected = meal.id === selectedMealId;
                return (
                  <div key={meal.id}>
                    <motion.div
                      variants={cardVariants}
                      custom={{ direction }}
                      exit="exit"
                      tabIndex={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.5 } }}
                    >
                      <Card
                        meal={meal}
                        meals={meals}
                        onClick={() => {
                          // setIsSelected(selectedMealId === meal.id);
                          // handleCardClick(meals, meal);
                          // handleDirectionChange(isSelected ? "down" : "up");

                          handleSelectedCardClick(meal.id);
                        }}
                        // isSelected={isSelected}
                        cardContainerClass={module.cardContainer}
                        cardClass={
                          index === 0
                            ? `${module.card} ${module.firstCard}`
                            : `${module.card} ${module.secondCard}`
                        }
                        titleClass={module.cardTitle}
                        btnClass={
                          selectedMealId === meal.id
                            ? module.cardButtonActive
                            : module.cardButton
                        }
                        btnIconClass={
                          selectedMealId === meal.id
                            ? module.cardButtonIconActive
                            : module.cardButtonIcon
                        }
                        textClass={
                          selectedMealId === meal.id
                            ? module.cardTextActive
                            : module.cardText
                        }
                        overlayClass={
                          selectedMealId === meal.id
                            ? module.cardOverlayActive
                            : ""
                        }
                        imageClass={module.cardImage}
                        deckContainerClass={module.cardDeckContainer}
                        deckClass={
                          index === 0
                            ? `${module.cardDeck} ${module.firstCardDeck}`
                            : `${module.cardDeck} ${module.secondCardDeck}`
                        }
                      />
                    </motion.div>
                  </div>
                );
              })}
          </AnimatePresence>
        </div>
      </div>
    </Page>
  );
};

export default ChoiceUI;
