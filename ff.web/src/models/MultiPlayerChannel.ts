import { ChannelUser } from "@vuo/stores/WebSocketStore";

export interface MultiPlayerChannel {
  url: string;
  users: ChannelUser[];
  questId: string;
}