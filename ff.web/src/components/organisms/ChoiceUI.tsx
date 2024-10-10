import { useState } from "react";
import Page from "../templates/Page";

import { motion, AnimatePresence } from "framer-motion";
import Card from "@vuo/components/atoms/Card";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import module from "@vuo/scss/components/organisms/ChoiceUI.module.scss";
import { CardSwipeDirection } from "@vuo/types/moleculeProps";
import { useFlavourFlow } from "@vuo/context/FlavourFlowContext";

const ChoiceUI: React.FC = () => {
  const { currentPair, handleChoice } = useFlavourFlow();
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [directions, setDirections] = useState<CardSwipeDirection>({});

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

  const handleCardClick = (
    currentPair: FlavourFlowMeal[],
    meal: FlavourFlowMeal,
  ) => {
    setSelectedMealId(meal.id);
    const loser = currentPair.find((m) => m.id !== meal.id) as FlavourFlowMeal;
    handleChoice(meal, loser);

    const newDirections: CardSwipeDirection = {
      [meal.id]: "up",
      [loser.id]: "down",
    };
    setDirections(newDirections);

    setTimeout(() => {
      setSelectedMealId(null);
      setDirections({});
    }, 300);
    return meal.id;
  };

  return (
    <Page>
      <div className={module.staticContainer}>
        <div>
          <AnimatePresence>
            {currentPair.map((meal: FlavourFlowMeal, index: number) => {
              return (
                <motion.div
                  key={meal.id}
                  variants={cardVariants}
                  custom={{ direction: directions[meal.id] || "" }}
                  exit="exit"
                  tabIndex={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                >
                  <Card
                    meal={meal}
                    meals={currentPair}
                    onClick={() => {
                      handleCardClick(currentPair, meal);
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
                      selectedMealId === meal.id ? module.cardOverlayActive : ""
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
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </Page>
  );
};

export default ChoiceUI;
