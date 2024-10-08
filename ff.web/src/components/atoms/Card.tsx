import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import HeartIcon from "./HeartIcon";
import { CardProps } from "@vuo/types/atomProps";

const Card = ({
  id,
  meal,
  onClick,
  isSelected,
  cardClass,
  titleClass,
  btnActiveClass,
  btnIconActiveClass,
  textActiveClass,
  overlayActiveClass,
  btnClass,
  btnIconClass,
  imageClass,
  deckContainerClass,
  deckClass,
  meals,
}: CardProps) => {
  const y = useMotionValue(0);
  const offsetBoundary = 150;
  const inputY = [-offsetBoundary, 0, offsetBoundary];
  const outputY = [-200, 0, 200];
  const drivenY = useTransform(y, inputY, outputY);

  return (
    <>
      <motion.div style={{ y: drivenY }} whileHover={{ scale: 1.1 }}>
        <div key={meal.id} id={id} onClick={onClick} className={cardClass}>
          <div className={titleClass}>
            <p>{meal.title}</p>
          </div>
          <AnimatePresence>
            {isSelected && (
              <>
                <motion.div
                  className={btnActiveClass}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.1 } }}
                  exit={{
                    opacity: 1,
                    transition: { duration: 0.5, ease: "easeInOut" },
                  }}
                >
                  <HeartIcon className={btnIconActiveClass} />
                </motion.div>
                <motion.div
                  className={textActiveClass}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.1 } }}
                  exit={{
                    opacity: 1,
                    transition: { duration: 0.5, ease: "easeInOut" },
                  }}
                >
                  chosen!
                </motion.div>
                <motion.div
                  className={overlayActiveClass}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 1 } }}
                  exit={{
                    opacity: 0.5,
                    transition: { duration: 0.5, ease: "easeInOut" },
                  }}
                ></motion.div>
              </>
            )}
          </AnimatePresence>
          <div className={btnClass}>
            <HeartIcon className={btnIconClass} />
          </div>
          <img src={meal.image} alt={meal.title} className={imageClass} />
        </div>
      </motion.div>
      <div className={deckContainerClass}>
        {meals && meals.length > 1 && <div className={deckClass}></div>}
      </div>
    </>
  );
};

export default Card;
