import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { BaseViewModel, BaseViewModelProps } from "@vuo/viewModels/BaseViewModel";

import questDataStore, { CategoryQuest } from "@vuo/stores/QuestDataStore";
import { Quest } from "@vuo/models/Quest";
import { PlayerAchievement } from "@vuo/models/PlayerAchievement";
import { PlayerProfile } from "@vuo/models/PlayerProfile";

export interface QuestLinePlayerAchievement extends PlayerAchievement {
  progressQuests?: Quest[];
}

export interface QuestLine {
  mainPlayerAchievement: PlayerAchievement;
  subPlayerAchievements?: QuestLinePlayerAchievement[];
  completedPercentage: number;
}

export default class QuestBrowseViewModel extends BaseViewModel {

  questDataStore = questDataStore
  foundQuests?: Quest[]
  currentQuestLines: QuestLine[] = []

  constructor() {
    super()

    makeObservable(this, {
      ...BaseViewModelProps,
      loadData: action,
      searchQuests: action,
      data: computed,
      currentQuestLines: observable,
      foundQuests: observable,
    })

    this.loadData()
  }

  get data(): CategoryQuest[] | undefined {
    return this.questDataStore.data
  }

  async loadData(): Promise<void> {
    const data = await this.fetchData<Quest[]>({ url: 'v1/quests', method: 'GET' });

    if (data) {
      const tagMap: Record<string, CategoryQuest> = {}

      data.forEach(quest => {
        quest.tags.forEach(tag => {
          if (!tagMap[tag.title]) {
            tagMap[tag.title] = { title: tag.title, quests: [] };
          }
          tagMap[tag.title].quests.push(quest);
        });
      });
      runInAction(() => {
        this.questDataStore.data = Object.values(tagMap)
      })
    }

    const playerProfile = await this.fetchData<PlayerProfile>({ url: '/players/me/profile', method: 'GET' })
    if (playerProfile) {
      const { trackedPlayerAchievements } = playerProfile
      const achievements = await this.fetchData<PlayerAchievement[]>({ url: '/playerAchievements/me', method: 'GET' })
      if (achievements) {
        const questLines = trackedPlayerAchievements.map(trackedPlayerAchievement => {
          const mainPlayerAchievement = achievements!.find(questLine => (questLine.achievement.id === trackedPlayerAchievement.achievement.id))
          if (mainPlayerAchievement) {
            const subPlayerAchievements = achievements!.filter(subQuestline =>
              mainPlayerAchievement?.achievement.subAchievements.some(subAchievement =>
                subAchievement.id === subQuestline.achievement.id
              )
            );
            const completedPercentage = (subPlayerAchievements.filter(sb => sb.completed).length / subPlayerAchievements.length) * 100
            return {
              mainPlayerAchievement,
              subPlayerAchievements,
              completedPercentage
            } as QuestLine
          }
          return undefined
        }).filter(Boolean) as QuestLine[]
        runInAction(() => {
          this.currentQuestLines = questLines || []
        })
      }
    }
  }

  async searchQuests(): Promise<void> {
    const data = await this.fetchData<Quest[]>({ url: 'api/quests/search', method: 'GET' });

    if (data) {
      runInAction(() => {
        this.foundQuests = data
      })
    }
  }
}