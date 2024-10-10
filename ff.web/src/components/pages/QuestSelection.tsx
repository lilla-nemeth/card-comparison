import { useState } from "react";
import { observer } from "mobx-react-lite";
import QuestBrowseViewModel from "@vuo/viewModels/QuestBrowseViewModel";
import { useNavigate } from "react-router-dom";
// import { Flags } from 'react-feature-flags';

// import { LogoVariants } from "@vuo/utils/LogoUtils";
import Loading from "@vuo/atoms/Loading";
import QuestCardCategory from "@vuo/organisms/QuestCardCategory";
import QuestLine from "@vuo/organisms/QuestLine";
import styles from "./QuestSelection.module.scss";
import Page from "../templates/Page";


const QuestSelection = observer(() => {
  const navigate = useNavigate();

  const [viewModel] = useState<QuestBrowseViewModel>(
    () => new QuestBrowseViewModel(),
  );
console.log(JSON.stringify(viewModel.data))
  const onSelectQuest = (questId: string) => {
    navigate(`/quests/${questId}/intro`);
  };

  const onSelectQuestLine = (id: string) => {
    navigate(`/questline/${id}`);
  };

  const isError = !viewModel.loading && viewModel.errors && Object.keys(viewModel.errors).length > 0
  const isLoading = viewModel.loading

  return (
    <Page>
      {/* <div className={styles.logoContainer}>
        <FixFoodLogo variant={LogoVariants.default} />
      </div> */}
      {/* <Flags authorizedFlags={['devMode']}>
        <h1>!DEV MODE!</h1>
      </Flags> */}
      {/* TODO display error messages properly */}
      { isError && (
        
        <h4>Oh no, there is no ErrorBlock component :O</h4> 
      )}
      {/* TODO make a Loading indicator */}
      {isLoading && <h4>Loading...</h4>} 
      {/* {!viewModel.loading && (
        <div className="mt16 width100">
          {viewModel.currentQuestLines.map(currentQuestLine =>
            <QuestLine
              hideButton={false}
              playerAchievement={currentQuestLine.mainPlayerAchievement}
              subPlayerAchievements={currentQuestLine.subPlayerAchievements}
              onSelectQuestLine={onSelectQuestLine}
            />
          )}
        </div>
      )} */}
      {!viewModel.loading && viewModel.data && (
        <>
          {viewModel.data.length > 0 ? (
            viewModel.data
              .slice()
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((questCategory) => (
                <QuestCardCategory
                  category={questCategory.title}
                  key={questCategory.title}
                  quests={questCategory.quests}
                  onSelectQuest={onSelectQuest}
                />
              ))
          ) : (
            <div>
              <h4>No quests available</h4>
            </div>
          )}
        </>
      )}
    </Page>
  );
});

export default QuestSelection;
