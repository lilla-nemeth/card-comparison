/* eslint-disable no-underscore-dangle */
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store"
import { Achievement } from "@vuo/models/Achievement";
import { PlayerAchievement } from "@vuo/models/PlayerAchievement";

class PlayerAchievementStore {
  achievements: Achievement[] = [];

  playerAchievements: PlayerAchievement[] = [];

  constructor() {
    makeObservable(this, {
      updatePlayerAchievement: action,
      getPlayerAchievementsForQuestById: computed,
      playerAchievements: observable
    })
    this.init()
  }

  private async init() {
    await makePersistable(this, {
      name: "PlayerAchievementStore",
      properties: ["achievements", "playerAchievements"],
      storage: window.localStorage,
    });
  }

  get getPlayerAchievementsForQuestById() {
    return (id: string) => this.playerAchievements.filter(pa => pa.questId === id);
  }

  getPlayerAchievementBy(achievementId: string): PlayerAchievement | undefined {
    return this.playerAchievements.find(pa => pa.achievement._id === achievementId);
  }

  getAchievementBy(achievementId: string): Achievement | undefined {
    return this.achievements.find(ach => ach._id === achievementId);
  }

  updatePlayerAchievement(playerAchievement: PlayerAchievement) {
    let updatedPlayerAchievements: PlayerAchievement[] = []
    const currentIndex = this.playerAchievements.findIndex(pa => pa.achievement._id === playerAchievement.achievement._id);
    if (currentIndex > -1) {
      updatedPlayerAchievements = [...this.playerAchievements]
      updatedPlayerAchievements[currentIndex] = { ...playerAchievement }
    } else {
      updatedPlayerAchievements = [...this.playerAchievements, playerAchievement]
    }
    runInAction(() => {
      this.playerAchievements = updatedPlayerAchievements
    })
  }
}

const playerAchievementStore = new PlayerAchievementStore()
export default playerAchievementStore