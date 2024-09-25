// import { Meal } from "../pages/FlavourFlowPage";
// import module from './ChoiceUI.module.scss';

// interface ChoiceUIProps {
//   handleChoice: (choice: string) => void;
//   currentPair: Meal[];
// } 

// const ChoiceUI = ({currentPair, handleChoice}: ChoiceUIProps) => {
//   console.log(currentPair)
//   return (
// <> 
//       <div 
//         style={{display: 'flex', justifyContent: 'space-around'}}
//       >
//         {
//           currentPair.map((meal, index) => {
//             // Determine the other meal in the pair (the "loser")
//             const otherMeal = currentPair[(index + 1) % 2];
            
//             return (
//               <div
//                 key={meal.id}  // Always add a unique key when rendering lists in React
//                 onClick={() => handleChoice(meal, otherMeal)}  // Pass both winner (clicked) and loser (not clicked)
//                 className={module.card}
//               >
//                 <img src={meal.image} alt={meal.title} />
//                 <p>{meal.title}</p>
//               </div>
//             );
//           })
//         }
//       </div>

//     </>
//   )
// };

// export default ChoiceUI;

import { useState } from 'react';
import { Meal } from "../pages/FlavourFlowPage";
import module from './ChoiceUI.module.scss';
import { motion } from 'framer-motion'; // Import Framer Motion

interface ChoiceUIProps {
  handleChoice: (winner: Meal, loser: Meal) => void;
  currentPair: Meal[];
}

const ChoiceUI = ({ currentPair, handleChoice }: ChoiceUIProps) => {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const handleCardClick = (winner: Meal, loser: Meal) => {
    setSelectedMeal(winner.id);  // Mark the selected meal as the winner
    setTimeout(() => {
      handleChoice(winner, loser);  // Trigger choice function after animation
      setSelectedMeal(null);  // Reset the selected state for the next round
    }, 500);  // Match this timeout with the animation duration
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      {currentPair.map((meal, index) => {
        const isWinner = selectedMeal === meal.id; // Check if the current card is the winner
        const otherMeal = currentPair[(index + 1) % 2]; // Get the other meal in the pair (loser)
        console.log(selectedMeal)
        return (
          <motion.div
            key={`${meal.id}-${selectedMeal}`}  // Ensure a unique key for each render
            onClick={() => handleCardClick(meal, otherMeal)}
            className={module.card}
            initial={{ y: 0, opacity: 1 }}  // Cards start in their normal position, fully visible
            animate={
              selectedMeal
                ? isWinner
                  ? { y: -100, opacity: 0 }  // Winner card slides up and fades out
                  : { y: 100, opacity: 0 }   // Loser card slides down and fades out
                : { y: 0, opacity: 1 }        // Reset for new cards, no animation on re-render
            }
            transition={{ duration: 0.3, ease: "easeOut" }}  // Smooth transition for both winner and loser
          >
            {selectedMeal === meal.id && <h4 className={module.overlay}> chosen!</h4>}  {/* Add overlay for selected card */}
            <img src={meal.image} alt={meal.title} />
            <p>{meal.title}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ChoiceUI;


