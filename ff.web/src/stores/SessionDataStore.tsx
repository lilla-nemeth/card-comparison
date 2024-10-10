import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store"
import { ChannelUser } from "./WebSocketStore";

class SessionDataStore {
  token?: string = undefined;
  shadowAccount: boolean = false
  username: string = ""
  user?: ChannelUser = undefined;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  private async init() {
    await makePersistable(this, {
      name: "SessionDataStore",
      properties: ["token", "shadowAccount", "username", "user"],
      storage: window.localStorage,
    });
  }
}

const sessionDataStore = new SessionDataStore()
export default sessionDataStore