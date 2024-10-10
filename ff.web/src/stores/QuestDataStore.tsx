import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store"
import { Quest } from "@vuo/models/Quest";

export interface CategoryQuest {
  title: string;
  quests: Quest[];
}

class QuestDataStore {
  data?: CategoryQuest[] = undefined;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  private async init() {
    await makePersistable(this, {
      name: "QuestDataStore",
      properties: ["data"],
      storage: window.localStorage,
    });
  }

  get getQuestById() {
    return (id: string): Quest | undefined => {
      if (!this.data) return undefined;

      return this.data.reduce(
        (foundQuest: Quest | undefined, category: CategoryQuest) =>
          foundQuest || category.quests.find(q => q.id === id),
        undefined
      );
    }
  }
}

const questDataStore = new QuestDataStore()
export default questDataStore