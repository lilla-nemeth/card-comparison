import { useEffect, useState } from "react";
import Page from "../templates/Page";
import { ChoiceUIProps } from "@vuo/types/organismProps";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@vuo/components/atoms/Card";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import module from "@vuo/scss/components/organisms/ChoiceUI.module.scss";
import { CardSwipeDirection } from "@vuo/types/moleculeProps";
import { useFlavourFlow } from "@vuo/context/FlavourFlowContext";

const ChoiceUI: React.FC<ChoiceUIProps> = () => {
  const { currentPair, handleChoice } = useFlavourFlow();
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [direction, setDirection] = useState<CardSwipeDirection | "">("");

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

  // This updates the selectedMealId
  const handleSelectedCard = (id: FlavourFlowMeal["id"]) => {
    setSelectedMealId(id);
  };

  const handleCardClick = (
    currentPair: FlavourFlowMeal[],
    meal: FlavourFlowMeal,
  ) => {
    // setSelectedMealId(meal.id);
    const loser = currentPair.find((m) => m.id !== meal.id) as FlavourFlowMeal;
    handleChoice(meal, loser);

    setTimeout(() => {
      setSelectedMealId(null);
    }, 300);
    return meal.id;
  };

  // const handleDirectionChange = (newDirection: "up" | "down") => {
  //   setDirection(newDirection);

  //   setTimeout(() => {
  //     setDirection("");
  //   }, 300);
  // };

  return (
    <Page>
      <div className={module.staticContainer}>
        <div>
          <AnimatePresence>
            {currentPair.map((meal: FlavourFlowMeal, index: number) => {
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
                      meals={currentPair}
                      onClick={() => {
                        handleSelectedCard(meal.id);
                        handleCardClick(currentPair, meal);
                        // handleDirectionChange(
                        //   selectedMealId !== null ? "down" : "up",
                        // );
                      }}
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
