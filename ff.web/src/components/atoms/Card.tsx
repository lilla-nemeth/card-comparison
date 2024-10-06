// import { Card as AntDCard } from "antd-mobile";
import { CardProps } from "@vuo/types/atomProps";
import HeartIcon from "./HeartIcon";
import { motion } from "framer-motion";
import { useState } from "react";

const Card: React.FC<CardProps> = ({
  meals,
  meal,
  onClick,
  isSelected,
  isActive,
  //   animate,
  transition,
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
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onClick();

    setTimeout(() => setClicked(false), 300);
  };

  return (
    <>
      <motion.div
        key={meal.id}
        onClick={handleClick}
        className={cardClass}
        // animate={animate}
        animate={{ y: clicked ? (!isActive ? -300 : 300) : 0 }}
        transition={transition}
      >
        <div className={titleClass}>
          <p>{meal.title}</p>
        </div>
        {isSelected && (
          <>
            <div className={btnActiveClass}>
              <HeartIcon className={btnIconActiveClass} />
            </div>
            <div className={textActiveClass}>chosen!</div>
            <div className={overlayActiveClass}></div>
          </>
        )}
        <div className={btnClass}>
          <HeartIcon className={btnIconClass} />
        </div>
        <img src={meal.image} alt={meal.title} className={imageClass} />
      </motion.div>

      <div className={deckContainerClass}>
        {meals.length > 1 && <div className={deckClass}></div>}
      </div>
    </>
  );
};
export default Card;
