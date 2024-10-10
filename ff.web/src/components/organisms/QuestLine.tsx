import { useEffect, useRef, useState } from 'react';
import { PlayerAchievement } from '@vuo/models/PlayerAchievement';
import { Tooltip } from 'antd';
import ThrophyActive from "../../../public/static/icons/achievement-throphy-active.svg"
import ThrophyPassive from "../../../public/static/icons/achievement-throphy-passive.svg"
import AchievementGoal from "../../../public/static/icons/achievement-goal.svg"
import DateComponent from '../../../../../web-monolith/ff.web/src/components/molecyles/DateComponent';
import styles from './QuestLine.module.scss';
import Button from '../../../../../web-monolith/ff.web/src/components/atoms/Button';

export type QuestLineProps = {
  playerAchievement: PlayerAchievement;
  subPlayerAchievements?: PlayerAchievement[];
  onSelectQuestLine?: (id: string) => void;
  hideButton: boolean
}

function QuestLine(props: QuestLineProps) {
  const { playerAchievement, subPlayerAchievements, onSelectQuestLine, hideButton } = props;
  const [visibleIndexes, setVisibleIndexes] = useState(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = parseInt(entry.target.getAttribute('data-index') ?? "0", 10);
        setVisibleIndexes(prevIndexes => {
          const newIndexes = new Set(prevIndexes);
          if (entry.isIntersecting) {
            newIndexes.add(index);
          } else {
            newIndexes.delete(index);
          }
          return newIndexes;
        });
      });
    }, { root: containerRef.current, threshold: 0.5 });

    const items = containerRef.current ? Array.from(containerRef.current.children) : [];
    items.forEach(item => observer.observe(item));
    return () => items.forEach(item => observer.unobserve(item));
  }, [subPlayerAchievements]);

  function getLineBeforeStyle(index: number) {
    if (index === 0) {
      return "none";
    }
    return visibleIndexes.has(index - 1) && visibleIndexes.has(index) ? "4px solid #34C759" : "4px dotted #34C759";
  }

  function getLineAfterStyle(index: number) {
    if (visibleIndexes.has(index) && subPlayerAchievements && (index === subPlayerAchievements.length - 1 || visibleIndexes.has(index + 1))) {
      return "4px solid #34C759";
    }
    return "4px dotted #34C759";
  }

  const achievementDivider = (subPlayerAchievements?.length ?? 0) < 3 && subPlayerAchievements?.length ? (100 / subPlayerAchievements.length) : 33.33;

  return (
    <div className={styles.container}>
      <div className={styles.flexRow}>
        <div className={styles.name}>
          {playerAchievement.achievement.name}
        </div>
        {playerAchievement?.unlockedAt && <div className={styles.date}>
          Completed on <DateComponent date={playerAchievement?.unlockedAt} />
        </div>}
      </div>
      <div className={styles.mainContent}>
        <div ref={containerRef} className={styles.scrollContainer}>
          {subPlayerAchievements?.map((sa, index) => (
            // <div className={achievementLessThan3 ? styles.achievementContainerSmall : styles.achievementContainer} data-index={index} key={sa.id}>
            <div
              className={styles.achievementContainer}
              data-index={index}
              key={sa.id}
              style={{flex: `0 0 ${achievementDivider}%`}}
            >
              <div style={{ borderTop: getLineBeforeStyle(index) }} className={styles.endLine} />
              <Tooltip title={sa.achievement.name} trigger="hover" placement='top'>
                <img src={sa.completed ? ThrophyActive : ThrophyPassive} className={sa.completed ? styles.trophyImageActive : styles.trophyImagePassive} alt="achievement" />

              </Tooltip>
              <div style={{ borderTop: getLineAfterStyle(index) }} className={styles.endLine} />
            </div>
          )
          )}
        </div>
        <div className={styles.imageContainer}>
          <Tooltip title={playerAchievement.achievement.name} trigger="hover" placement='top'>
            <img src={AchievementGoal} className={styles.goal} alt="goal" />
          </Tooltip>
        </div>
      </div>
      {!hideButton && <Button color="default" className={styles.customButton} onClick={() => onSelectQuestLine?.(playerAchievement.id)}>Continue</Button>}
    </div>
  );
};

export default QuestLine;
