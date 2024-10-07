import { motion, useMotionValue, useTransform } from "framer-motion";
import HeartIcon from "./HeartIcon";
import { CardProps } from "@vuo/types/atomProps";

const Card = ({
  index,
  meal,
  onClick,
  drag,
  isSelected,
  handleDirectionChange,
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
  cardContainerClass,
  style,
}: CardProps) => {
  const y = useMotionValue(0);
  const offsetBoundary = 150;
  const inputY = [-offsetBoundary, 0, offsetBoundary];
  const outputY = [-200, 0, 200];
  const drivenY = useTransform(y, inputY, outputY);

  const handleDrag = (_: any, info: any) => {
    const offset = info.offset.y;

    if (offset < 0 && offset < offsetBoundary * -1) {
      setIsDragOffBoundary("up");
    } else if (offset > 0 && offset > offsetBoundary) {
      setIsDragOffBoundary("down");
    } else {
      setIsDragOffBoundary(null);
    }
  };

  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);
    setIsDragOffBoundary(null);
    const isOffBoundary =
      info.offset.y > offsetBoundary || info.offset.y < -offsetBoundary;

    if (isOffBoundary) {
      const direction = info.offset.y > 0 ? "down" : "up";
      handleDirectionChange(isSelected as boolean);
      setDirection(direction);
    }
  };
  return (
    <motion.div
      drag={drag}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      dragSnapToOrigin
      dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
      style={{ y: drivenY }}
      onDragStart={() => setIsDragging(true)}
      className={cardContainerClass}
    >
      <div key={meal.id} onClick={onClick} className={cardClass}>
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
      </div>
    </motion.div>
  );
};

export default Card;

{
  /* <div className={deckContainerClass}>
  {meals.length > 1 && <div className={deckClass}></div>}
</div> */
}
