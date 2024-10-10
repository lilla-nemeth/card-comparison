import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { Howl } from 'howler';
import QuestIntroViewModel from "@vuo/viewModels/QuestIntroViewModel";
import ErrorBlock from "@vuo/molecyles/ErrorBlock";
// import Loading from "@vuo/atoms/Loading";
import EventBus from "@vuo/utils/EventBus";
import Page from "@vuo/atoms/Page";
import QuestCard from "@vuo/organisms/QuestCard";
import Banner from "@vuo/molecyles/Banner";
import Picker from "@vuo/molecyles/Picker";
import SkewedTitleList, { SkewedTitle } from "@vuo/molecyles/SkewedTitleList";
import { ChannelUser } from "@vuo/stores/WebSocketStore";
import PlayerItem from '@vuo/organisms/PlayerItem';

import soundFile from '@assets/fixfood/swishh.mp3';

const QuestIntro = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [viewModel] = useState<QuestIntroViewModel>(
    () => new QuestIntroViewModel(id!),
  );
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [bannerQueue, setBannerQueue] = useState<{ title: string; subtitle: string }[]>([]);
  const [currentBanner, setCurrentBanner] = useState<{ title: string; subtitle: string } | null>(null);
  const [claimVisible, setClaimVisible] = useState<boolean>(false)

  useEffect(() => {
    if (bannerQueue.length > 0 && !currentBanner) {
      // Set the first banner in the queue as the current banner
      setCurrentBanner(bannerQueue[0]);

      // Remove the first banner from the queue
      setBannerQueue((prevQueue) => prevQueue.slice(1));
    }
  }, [bannerQueue, currentBanner]);

  const handleBannerClose = () => {
    setCurrentBanner(null);
  };

  useEffect(() => {
    if (viewModel.playerQuest) {
      setShowCountdown(true);
      setTimeout(() => {
        setShowCountdown(false);
        navigate(`/playerQuests/${viewModel.playerQuest!.id}/play/`);
      }, 2000);
    }
    viewModel.getGroupMemberships();
  }, [viewModel, viewModel.playerQuest, navigate]);

  useEffect(() => {
    if (viewModel.isCurrentUserHost || !viewModel.multiplayerSessionURL) { return }
    if (viewModel.memberships.length === 0 || viewModel.isCurrentUserMember) {
      setClaimVisible(false)
    } else {
      setClaimVisible(true)
    }
  }, [viewModel.memberships, viewModel.multiplayerUsers, viewModel.isCurrentUserHost, viewModel.isCurrentUserMember, viewModel.multiplayerSessionURL])

  useEffect(() => {
    const addBannerToQueue = (title: string, subtitle: string) => {
      if (bannerQueue.some(b => b.title.includes(title))) return;
      setBannerQueue((prevQueue) => [...prevQueue, { title, subtitle }]);
    };

    const addBanner = (user: ChannelUser) => {
      addBannerToQueue("New Chef is joining!", user.username)
    };

    EventBus.on("playerJoinedChannel", addBanner);
    return () => {
      EventBus.off('playerJoinedChannel', addBanner);
    };
  }, [bannerQueue]);

  const sound = new Howl({
    src: [soundFile],
    preload: true
  });

  const playMultipleSounds = (numberOfSounds: number, delay: number) => {
    sound.play();
    for (let i = 1; i < numberOfSounds; i += 1) {
      setTimeout(() => {
        sound.play();
      }, i * delay);
    }
  };

  const onStartQuest = () => {
    playMultipleSounds(4, 300)
    viewModel.startCurrentQuest();
  };

  const countdownTitles = (): SkewedTitle[] => {
    const randomSkills = viewModel.getRandomSkills();
    const titles: SkewedTitle[] = [{ title: "Get ready to" }];

    randomSkills.forEach((skill, index) => {
      titles.push({
        title: skill.name,
        backgroundColor: index % 2 ? "var(--red)" : "var(--yellow)",
      });
    });

    return titles;
  };

  const createSession = () => {
    const url = new URL(window.location.href);
    const relevantPath = url.pathname.split('/app')[1];
    viewModel.startMPSession(relevantPath!)
  }

  const closeSession = () => {
    viewModel.closeMPSession()
  }

  const leaveSession = () => {
    viewModel.leaveSession()
  }

  const onAddGroupMembership = (nickname: string) => {
    viewModel.addGroupMembership(nickname)
  }

  const basicColumns = () => {
    if (!viewModel.memberships) { return [] }
    const membershipsWithoutClaim = viewModel.memberships.filter(m => !m.userId)
    const claims = membershipsWithoutClaim.map(m => ({
      label: m.nickname,
      value: m.id
    }))
    return [[{ label: 'None', value: '' }, ...claims]]
  }

  return (
    <Page containerClass="page-container">
      {showCountdown && (
        <div className="text-center">
          <SkewedTitleList items={countdownTitles()} sequential />
        </div>
      )}
      {!showCountdown && !viewModel.loading && viewModel.errors && (
        <ErrorBlock description={viewModel.errors.message} title="Oh noes" />
      )}
      {/* {viewModel.loading && <Loading />} */}
      {!showCountdown && viewModel.quest && (
        <div style={{ color: 'black' }}>
          {currentBanner && (
            <Banner
              title={currentBanner.title}
              subtitle={<PlayerItem color="blue" title={currentBanner.subtitle} />}
              duration={2000} // 2 seconds
              onClose={handleBannerClose}
            />
          )}
          <Picker
            cancelText="Back"
            closeOnMaskClick
            columns={basicColumns}
            confirmText="Claim"
            visible={claimVisible}
            title="Pick membership"
            onClose={() => setClaimVisible(false)}
            onConfirm={(value) => viewModel.claimMembership(value.toString())}
            renderLabel={(item) => (<div style={{ color: 'black' }}>{item.label}</div>)}
          />
          <QuestCard
            hideStartButton={(!viewModel.isCurrentUserHost && viewModel.multiplayerSessionURL !== null)}
            onAddGroupMembership={onAddGroupMembership}
            onCloseSession={closeSession}
            onCreateSession={createSession}
            onLeaveSession={leaveSession}
            onStartQuest={onStartQuest}
            isCurrentUserHost={viewModel.isCurrentUserHost}
            multiplayerSessionURL={viewModel.multiplayerSessionURL || undefined}
            multiplayerUsers={viewModel.multiplayerUsers}
            groupMembers={viewModel.memberships}
            quest={viewModel.quest} />
          {/* {viewModel.unlockableAchievements.length > 0 && (
            <>
              <div className="font-big white" style={{ color: "var(--white)" }}>
                By doing this quest, you unlock:
              </div>
              {viewModel.unlockableAchievements.map((achievement) => (
                <div key={achievement.id} style={{ color: "white" }}>
                  {achievement.name}, {achievement.description}
                </div>
              ))}
            </>
          )} */}
        </div>
      )}
    </Page>
  );
});

export default QuestIntro;
