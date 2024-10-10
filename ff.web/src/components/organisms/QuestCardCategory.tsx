import { useState, useEffect } from 'react';
import { Quest } from '@vuo/models/Quest';
import Button from '@vuo/atoms/Button';
import QuestSelectCard from '@vuo/molecules/QuestSelectCard';
import styles from './QuestCardCategory.module.scss';

export interface QuestCardCategoryProps {
  category: string | React.ReactNode;
  quests: Quest[];
  onSelectQuest?: (questId: string) => void;
}

function QuestCardCategory(props: QuestCardCategoryProps) {
  const { category, quests, onSelectQuest } = props;
  const [visibleCount, setVisibleCount] = useState(6);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 425);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 425);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const showMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        {category}
      </h3>
      <div className={styles.quests_container}>
        {quests.slice(0, isWideScreen ? visibleCount : quests.length).map((quest) => (
          <div key={quest.id} className={`${styles.quest_container}`}>
            <QuestSelectCard quest={quest} onClick={(selectedQuest) => onSelectQuest?.(selectedQuest.id)} />
          </div>
        ))}
        {isWideScreen && visibleCount < quests.length && (
          <Button
            block
            className={`${styles.show_more_button} btn btn-raised`}
            size='large'
            onClick={() => { showMore() }}
          >
            <span>Show More</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default QuestCardCategory;
