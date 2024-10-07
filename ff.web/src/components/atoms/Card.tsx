import { motion, useMotionValue, useTransform } from "framer-motion";
import HeartIcon from "./HeartIcon";
import { CardProps } from "@vuo/types/atomProps";

const Card = ({
  id,
  meal,
  onClick,
  drag,
  isSelected,
  setDirection,
  setIsDragging,
  setIsDragOffBoundary,
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
}: CardProps) => {
  const y = useMotionValue(0);
  const offsetBoundary = 150;
  const inputY = [-offsetBoundary, 0, offsetBoundary];
  const outputY = [-200, 0, 200];
  const drivenY = useTransform(y, inputY, outputY);

  const handleDrag = (_: any, info: any) => {
    const offset = info.offset.x;

    if (offset < 0 && offset < offsetBoundary * -1) {
      setIsDragOffBoundary("left");
    } else if (offset > 0 && offset > offsetBoundary) {
      setIsDragOffBoundary("right");
    } else {
      setIsDragOffBoundary(null);
    }
  };

  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);
    setIsDragOffBoundary(null);
    const isOffBoundary =
      info.offset.y > offsetBoundary || info.offset.y < -offsetBoundary;
    const direction = info.offset.y > 0 ? "down" : "up";

    if (isOffBoundary) {
      setDirection(direction);
    }
  };

  return (
    <>
      <motion.div
        key={meal.id}
        className={cardClass}
        onClick={onClick}
        drag={drag}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
        onDragStart={() => setIsDragging(true)}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y: drivenY }}
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

      {/* <div className={deckContainerClass}>
        {meals.length > 1 && <div className={deckClass}></div>}
      </div> */}
    </>
  );
};

export default Card;
