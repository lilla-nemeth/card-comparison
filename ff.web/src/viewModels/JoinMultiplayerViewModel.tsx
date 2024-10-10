import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { BaseViewModel, BaseViewModelProps } from "@vuo/viewModels/BaseViewModel";
import { MultiPlayerChannel } from "@vuo/models/MultiPlayerChannel";
import webSocketStore, { ChannelUser, ChannelUserRole } from "@vuo/stores/WebSocketStore";
import sessionDataStore from "@vuo/stores/SessionDataStore";
import { Quest } from "@vuo/models/Quest";
import { ShadowAccountResponse } from "./SneakPeekViewModel";


interface SessionResponse extends MultiPlayerChannel {
  quest: Quest;
}

export default class JoinMultiplayerViewModel extends BaseViewModel {
  private webSocketStore = webSocketStore;
  private sessionDataStore = sessionDataStore;

  quest?: Quest | null;
  channel?: MultiPlayerChannel | null;

  constructor() {
    super()

    makeObservable(this, {
      ...BaseViewModelProps,
      joinMPSession: action,
      authenticated: computed,
      host: computed,
      channel: observable,
      quest: observable
    })
  }

  get authenticated(): boolean {
    return !!this.sessionDataStore.token && this.sessionDataStore.token.length > 0
  }

  get host(): ChannelUser | undefined {
    return this.channel?.users.find(u => u.role === ChannelUserRole.Host)
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

  async fetchQuest(channelId: string): Promise<void> {
    const channel = await this.fetchData<SessionResponse>({ url: `v1/multiplayer/session/${channelId}`, method: 'GET' });
    if (channel) {
      runInAction(() => {
        this.channel = channel;
        this.quest = channel.quest;
      })
    }
  }

  async joinMPSession(channelId: string): Promise<void> {
    const storage = JSON.parse(localStorage.getItem('SessionDataStore')!)
    const { token } = storage
    this.webSocketStore.connect(token)
    this.webSocketStore.joinChannel(channelId)
  }
}