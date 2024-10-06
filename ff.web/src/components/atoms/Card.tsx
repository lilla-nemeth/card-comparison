// import { Card as AntDCard } from "antd-mobile";
import { CardProps } from "@vuo/types/atomProps";
import HeartIcon from "./HeartIcon";

const Card: React.FC<CardProps> = ({
  meals,
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
}) => {
  return (
    <>
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
      <div className={deckContainerClass}>
        {meals.length > 1 && <div className={deckClass}></div>}
      </div>
    </>
  );
};
export default Card;
