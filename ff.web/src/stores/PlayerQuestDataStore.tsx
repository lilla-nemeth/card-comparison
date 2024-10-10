import { makeAutoObservable, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store"
import { PlayerQuest } from "@vuo/models/PlayerQuest";

class PlayerQuestDataStore {
  playerQuests: PlayerQuest[] = [];

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  private async init() {
    await makePersistable(this, {
      name: "PlayerQuestDataStore",
      properties: ["playerQuests"],
      storage: window.localStorage,
    });
  }

  addPlayerQuest(pq: PlayerQuest) {
    runInAction(() => {
      const index = this.playerQuests.findIndex(existingPq => existingPq.id === pq.id);
      if (index > -1) {
        this.playerQuests[index] = pq;
      } else {
        this.playerQuests.push(pq);
      }
    });
  }

  getPlayerQuestById(id: string) {
      return this.playerQuests.find(pq => pq.id === id)
  }
}

const playerQuestDataStore = new PlayerQuestDataStore()
export default playerQuestDataStore