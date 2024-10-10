import { observable, makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from "mobx-persist-store"
import { jwtDecode } from "jwt-decode";
import EventBus from "@vuo/utils/EventBus";
import { PlayerQuest } from '@vuo/models/PlayerQuest';

import { Message, MessageType } from '@vuo/models/channelMessage';

export enum ChannelUserRole {
  Host = 'host',
  Member = 'member',
}

export interface ChannelUser {
  id: string;
  color: string;
  role: ChannelUserRole;
  username: string;
  currentUser: boolean;
}

class WebSocketStore {
  ws: WebSocket | null = null;
  users: ChannelUser[] = [];
  channelId: string | null = null;
  messageQueue: Message[] = [];
  token: string | null = null;
  currentUserId: string | null = null;
  url: string | null = null;

  constructor() {
    makeAutoObservable(this, {
      currentUser: observable
    });
    this.init();
  }

  private async init() {
    await makePersistable(this, {
      name: "WebSocketStore",
      properties: ["channelId", "users", "token", "url"],
      storage: window.localStorage
    })

    const storage = JSON.parse(localStorage.getItem('SessionDataStore')!)
    const { token } = storage
    if (token) {
      runInAction(() => {
        this.token = token
        const decode = jwtDecode<{ id: string }>(token);
        this.currentUserId = decode.id
      })
    }

    if (this.token && this.channelId) {
      this.connect();
    }
  }

  get activeSession() {
    return this.url
  }

  handleMessage(message: Message) {
    runInAction(() => {
      switch (message.type) {
        case MessageType.ChannelCreated:
          this.channelId = message.channelId;
          this.users = message.users;
          this.url = message.url;
          break;
        case MessageType.JoinedChannel: {
          if (message.newUser && message.newUser.id !== this.currentUserId) {
            EventBus.emit("playerJoinedChannel", message.newUser);
          }
          this.channelId = message.channelId;
          this.users = message.users;
          this.url = message.url;
          break;
        }
        case MessageType.UpdatedPlayerQuest:
          EventBus.emit("playerQuestDataChanged", { playerQuest: message.playerQuest })
          break;
        case MessageType.ChannelClosed:
          runInAction(() => {
            this.channelId = null
            this.users = []
            this.messageQueue = []
            this.url = null
          })
          break
        case MessageType.UserLeftChannel:
          this.users = message.users;
          break
        case MessageType.Error:
          if (message.message === "Channel not found") {
            runInAction(() => {
              this.channelId = null;
              this.messageQueue = []
              this.users = []
              this.url = null
            })
          }
          break;
        case MessageType.MembershipClaimed:
          EventBus.emit("membershipClaimed", {})
          break;
        default:
          break;
      }
    })
  }

  connect(token?: string) {
    if (token) this.token = token
    if ((!this.token && token) || this.ws?.readyState === WebSocket.OPEN) return;
    this.ws = new WebSocket(`${WEBSOCKET_URL}?token=${this.token}`);

    this.ws.onopen = () => {
      this.processQueue();
      if (this.channelId) {
        this.rejoinChannel(this.channelId);
      }
    }

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message: Message = JSON.parse(event.data)
        this.handleMessage(message)
      } catch (err) {
        // console.error('failed to process message', err)
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
      // Optionally, implement reconnect logic here
    };
  }

  processQueue() {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        this.ws.send(JSON.stringify(message));
      }
    }
  }

  private sendMessageOrQueue(message: Message) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
      if (this.ws?.readyState !== WebSocket.CONNECTING) {
        this.connect(); // Attempt to reconnect if not already connecting
      }
    }
  }

  createChannel(url: string, questId: string) {
    runInAction(() => {
      this.messageQueue = []
    })
    this.sendMessageOrQueue({ type: MessageType.CreateChannel, url, questId });
  }

  joinChannel(channelId: string) {
    this.sendMessageOrQueue({ type: MessageType.JoinChannel, channelId });
  }

  claimMembership(id: string) {
    this.sendMessageOrQueue({ type: MessageType.ClaimMembership, id });
  }

  leaveChannel() {
    if (!this.channelId) return;
    this.sendMessageOrQueue({ type: MessageType.LeaveChannel, channelId: this.channelId });
    runInAction(() => {
      this.channelId = null
      this.users = []
      this.messageQueue = []
    })
  }

  closeChannel() {
    if (!this.channelId) return;
    this.sendMessageOrQueue({ type: MessageType.CloseChannel, channelId: this.channelId });
    runInAction(() => {
      this.channelId = null
      this.users = []
      this.messageQueue = []
    })
  }

  rejoinChannel(channelId: string) {
    this.sendMessageOrQueue({ type: MessageType.JoinChannel, channelId });
  }

  updatePlayerQuest(playerQuest: PlayerQuest) {
    this.sendMessageOrQueue({ type: MessageType.UpdatePlayerQuest, playerQuest })
  }

  channelUsers() {
    return this.users
      .map((user) => ({ ...user, currentUser: user.id === this.currentUserId }))
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  isCurrentUserHost() {
    const currentUser = this.users.find(user => user.id === this.currentUserId);
    return currentUser ? currentUser.role === 'host' : false;
  }

  currentUser() {
    return this.users.find(user => user.id === this.currentUserId);
  }
}

const webSocketStore = new WebSocketStore();
export default webSocketStore;
