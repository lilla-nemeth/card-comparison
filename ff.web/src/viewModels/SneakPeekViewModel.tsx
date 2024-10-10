import { action, makeObservable, observable, runInAction } from "mobx";
import { BaseViewModel, BaseViewModelProps } from "@vuo/viewModels/BaseViewModel";

import { Quest } from "@vuo/models/Quest";
import sessionDataStore from "@vuo/stores/SessionDataStore";
import { ChannelUser } from "@vuo/stores/WebSocketStore";

export interface SneakPeekQuest {
  quest: Quest;
  index: number;
}

interface SneakPeekQuests {
  quests: SneakPeekQuest[]
}

export interface ShadowAccountResponse {
  token: string;
  username: string;
  user: ChannelUser;
}

export default class SneakPeekViewModel extends BaseViewModel {
  private sessionDataStore = sessionDataStore;
  data?: SneakPeekQuests

  constructor(id: string) {
    super()

    makeObservable(this, {
      ...BaseViewModelProps,
      loadData: action,
      createShadowAccount: action,
      data: observable,
    })
    this.loadData(id)
  }

  async loadData(id: string): Promise<void> {
    const data = await this.fetchData<SneakPeekQuests>({ url: `v1/sneakPeekQuests/${id}`, method: 'GET' });
    if (data) {
      const sortedData = SneakPeekViewModel.sortQuests(data)
      runInAction(() => {
        this.data = sortedData
      })
    }
  }

  async createShadowAccount(): Promise<void> {
    const response = await this.fetchData<ShadowAccountResponse>({
      url: "v1/register/create-shadow-account",
      method: "POST"
    });
    this.sessionDataStore.token = response!.token;
    this.sessionDataStore.username = response!.username;
    this.sessionDataStore.user = response!.user;
    this.sessionDataStore.shadowAccount = true;
  }

  private static sortQuests(data: SneakPeekQuests): SneakPeekQuests {
    const sortedQuests = data.quests.sort((a, b) => a.index - b.index);
    return { quests: sortedQuests };
  }
}