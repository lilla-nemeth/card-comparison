import { makeObservable, observable, runInAction } from "mobx";
import { BaseViewModel, BaseViewModelProps } from "@vuo/viewModels/BaseViewModel";
import { QuestLine } from "./QuestBrowseViewModel";


export default class QuestLineViewModel extends BaseViewModel {

  questLine?: QuestLine

  constructor(id: string) {
    super()

    makeObservable(this, {
      ...BaseViewModelProps,
      questLine: observable,
    })

    this.loadData(id)
  }

  async loadData(id: string): Promise<void> {
    const response = await this.fetchData<QuestLine>({ url: `v1/playerAchievements/${id}`, method: 'GET' });
    if (response) {
      runInAction(() => {
        this.questLine = response
      })
    }
  }
}