import { FormEvent, useEffect, useState, CSSProperties, useRef } from 'react';
import { observer } from 'mobx-react-lite'
import { useNavigate, useParams } from 'react-router-dom';

import AchievementOutro from '@vuo/molecyles/AchievementOutro';
import Button from '@vuo/atoms/Button';
import Icon from '@vuo/atoms/Icon';
import Chip from '@vuo/atoms/Chip';
import Modal from '@vuo/atoms/Modal'
import Page from '@vuo/atoms/Page'
import Popup from '@vuo/atoms/Popup'
import QuestOutroViewModel from '@vuo/viewModels/QuestOutroViewModel';
import SkewedTitleList from '../../../../../web-monolith/ff.web/src/components/molecyles/SkewedTitleList';

import style from './QuestOutro.module.scss'

const QuestOutro = observer(() => {

  const navigate = useNavigate()

  const { id } = useParams()
  const [viewModel] = useState<QuestOutroViewModel>(() => new QuestOutroViewModel(id!))
  const [username, setUsername] = useState<string>("");
  const [popupVisible, setPopupVisible] = useState<boolean>(false)

  const achievementScroller = useRef<HTMLDivElement>(null)
  const achievementScrollerTrack = useRef<HTMLDivElement>(null)
  const AchievementDelay = 1000

  useEffect(() => {
    window.scrollTo(0, 0)
    const startInterval = 1000;
    const achievementScrollInterval = 500;

    const achievements = viewModel.playerAchievementsForCompletedQuest;
    if (!achievements || achievements.length === 0) return undefined;

    const scroller = achievementScroller.current;
    const scrollerTrack = achievementScrollerTrack.current;
    if (!scroller || !scrollerTrack) return undefined;

    let currentIndex = 0;
    let intervalId: NodeJS.Timeout

    setInterval(() => {
      intervalId = setInterval(() => {

        if (currentIndex >= achievements.length) {
          clearInterval(intervalId);
          scroller.classList.add(style.outro_achievements_scroller_snap)
          return undefined;
        }

        // Calculate the new scroll position
        const achievementElement = scrollerTrack.children[currentIndex] as HTMLElement;
        const newScrollPosition = achievementElement.offsetLeft;

        // Scroll the scroller container
        scroller.scrollTo({
          left: newScrollPosition,
          behavior: 'smooth'
        });

        currentIndex += 1
        return undefined
      }, achievementScrollInterval)
    }, startInterval);

    const calculateStyle = (element: HTMLElement): CSSProperties => {
      const scrollLeft = scroller.scrollLeft + scroller.clientWidth / 2;
      const elementCenter = element.offsetLeft + element.clientWidth / 2;
      const distanceFromCenter = Math.abs(scrollLeft - elementCenter);
      const maxDistance = scroller.clientWidth / 2;

      const opacity = 1.0 + (-0.5 / maxDistance) * distanceFromCenter;
      const scale = 1.0 + (-0.1 / maxDistance) * distanceFromCenter;
      return {
        opacity: `${opacity}`,
        scale: `${scale}`
      };
    };

    const updateStylesOnScroll = () => {
      if (!scrollerTrack) return;

      Array.from(scrollerTrack.children).forEach(child => {
        const element = child as HTMLElement;
        const newStyle = calculateStyle(element);
        Object.assign(element.style, newStyle);
      });
    };

    scroller.addEventListener('scroll', updateStylesOnScroll);
    updateStylesOnScroll();

    return () => {
      clearInterval(intervalId);
    };
  }, [viewModel.playerAchievementsForCompletedQuest]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    viewModel.registerShadowAccount(username).then(() => {
      Modal.alert({
        content: 'Account registered!',
        confirmText: 'Nice!',
        onConfirm: () => {
          navigate('/quests')
        }
      })
    })
  };

  const onContinue = () => {
    navigate(-3)
    // const sneakpeekorigin = localStorage.getItem("sneakpeekorigin")
    // if (sneakpeekorigin) {
    //   navigate(`/sneakpeek/${sneakpeekorigin}`)
    //   localStorage.removeItem("sneakpeekorigin")
    // } else {
    //   navigate('/quests')
    // }
  }

  const scoreScaleStyle: CSSProperties = {
    '--score-scale': `${1}`
  } as CSSProperties;

  const titleList = () => [
    { title: viewModel.playerQuest?.name || viewModel.playerQuest?.recipe.name || "Quest" },
    { title: "Completed" }
  ]

  return (
    <Page>
      {!viewModel.loading && viewModel.playerQuest && (
        <>
          <SkewedTitleList items={titleList()} sequential={false} />
          <div className={`${style.outro_achievements} mt48 align-items-center flex flex-col`}>
            <h2 className={`font-big font-weight-700 ${style.outro_achievements_title}`}>
              Achievements unlocked
            </h2>
            <div
              className={`${style.outro_achievements_scroller} ${style.outro_achievements_scroller_snap}`}
              ref={achievementScroller}>
              <div
                className={`${style.outro_achievements_scroller_track}`}
                ref={achievementScrollerTrack}
              >
                {viewModel.playerAchievementsForCompletedQuest?.map(playerAchievement =>
                (
                  <div
                    className={`${style.outro_achievements_scroller_box}`}
                    key={playerAchievement.achievement.name}>
                    <AchievementOutro playerAchievement={playerAchievement} />
                  </div>
                )
                )}
              </div>
            </div>
            <div className={`${style.outro_skills} mt16`}>
              {viewModel.combinedPlayerSkillsForCompletedQuest?.map((skill, index) => {
                const skillStyle: CSSProperties = {
                  backgroundColor: "var(--purple)",
                  '--delay': `${AchievementDelay + (viewModel.playerAchievementsForCompletedQuest?.length || 0) * 600 + 300 * (index + 1)}ms`
                } as CSSProperties;

                return (
                  <div
                    className={`${style.skill}`}
                    key={`${skill.name}_index`}
                    style={skillStyle}
                  >
                    <div>
                      {/* TODO fix icons  */}
                      {/* <Icon name="chef-knife" /> */}
                      Icon
                    </div>
                    <div className={`${style.skill_title} font-weight-600`}>
                      {skill.name}
                    </div>
                    <Chip className={`${style.skill_chip}`}>+{skill.challenge_rating}XP</Chip>
                  </div>
                )
              })}
            </div>
            <div
              className={`${style.outro_score} text-center flex flex-col`}
              style={scoreScaleStyle}
            >
              <div className={`${style.outro_skill_score_value} font-h3 font-weight-900 mt16`}>
                {viewModel.combinedPlayerSkillsForCompletedQuest?.reduce((prevValue, { challenge_rating }) => prevValue + challenge_rating, 0)}
              </div>
              <small className={`${style.outro_skill_text} font-weight-700 uppercase mb16 mt8`}>
                Cooking
                <br />
                Skill XP
                <br />
                Earned
              </small>
            </div>
          </div>
          <div className='mt48 width100'>
            <Button block className='btn btn-large btn-raised' color='primary' size='large' onClick={onContinue}>Continue</Button>
            {viewModel.shadowAccount && (
              <>
                <h1 style={{width: "100%", textAlign: "center"}}>or</h1>
                <Button block className='btn btn-large btn-raised' color='primary' size='large' onClick={() => setPopupVisible(true)}>Save your progress!</Button>
              </>
            )}
          </div>
          <Popup
            bodyStyle={{
              padding: '24px',
              textAlign: 'center',
            }}
            position='bottom'
            visible={popupVisible}
            onMaskClick={() => setPopupVisible(false)}
          >
            <form onSubmit={handleSubmit} autoComplete="on">
              <input
                type="text"
                id="username"
                aria-labelledby="username-label"
                autoComplete="username webauthn"
                placeholder="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
              <Button
                block
                className="btn btn-blue btn-large btn-raised mt16"
                color="primary"
                fill="solid"
                size="large"
                type="submit"
              >
                Register
              </Button>
            </form>
          </Popup>
        </>
      )}
      {!viewModel.playerQuest && (
        <div>No completed quest yet! Go and pick a quest or campaign!</div>
      )}
    </Page>
  );
});

export default QuestOutro;
