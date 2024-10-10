import { Quest } from '@vuo/models/Quest';
import Button from '@vuo/atoms/Button';
import Icon from '@vuo/atoms/Icon';
import styles from './QuestSelectCard.module.scss'

interface QuestSelectCardProps {
  quest: Quest;
  onClick?: (quest: Quest) => void;
}

function imageUrl(quest: Quest) {
  if (quest.media?.image) return quest.media.image
  if (quest.recipe?.media) return quest.recipe.media.image
  return null
}

function QuestMedia(props: { quest: Quest }) {
  const { quest } = props;
  let imageSrc = imageUrl(quest);
  if (!imageSrc) {
    imageSrc = "https://recipemedia.fra1.cdn.digitaloceanspaces.com/noMedia.png"
  };

  return (
    <div className={styles.img_container}>
      <img className={styles.img} alt="Quest media" src={`${imageSrc}`} />
    </div>
  )
}

function QuestSelectCard(props: QuestSelectCardProps) {
  const { quest, onClick } = props;

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    onClick?.(quest)
  }

  return (
    <div className={styles.container}>
      <QuestMedia quest={quest} />
      <div className={styles.title_container}>
        <h3 className={styles.title}>
          {quest.name ? quest.name : quest.recipe.name}
        </h3>
      </div>
      <div className={styles.text_container}>
        <span className={styles.text}>
          {quest.recipe?.description}
        </span>
      </div>
      <Button
        block
        className="btn btn-large btn-raised"
        color='primary'
        size='large'
        style={{ backgroundColor: "var(--blue)" }}
        onClick={(e) => { handleButtonClick(e) }}
      >
        {/* TODO fix icons */}
        {/* <Icon name='play' /> */}
        Icon
      </Button>
    </div>
  )
}

export default QuestSelectCard