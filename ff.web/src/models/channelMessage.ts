import { ChannelUser } from "@vuo/stores/WebSocketStore";
import { PlayerQuest } from "./PlayerQuest";

export enum MessageType {
  UpdatePlayerQuest = 'updatePlayerQuest',
  UpdatedPlayerQuest = 'UpdatedPlayerQuest',
  CreateChannel = 'createChannel',
  CloseChannel = 'CloseChannel',
  ChannelCreated = 'channelCreated',
  ChannelClosed = 'ChannelClosed',
  JoinChannel = 'joinChannel',
  JoinedChannel = 'joinedChannel',
  LeaveChannel = 'LeaveChannel',
  UserLeftChannel = 'UserLeftChannel',
  ClaimMembership = 'ClaimMembership',
  MembershipClaimed = 'MembershipClaimed',
  Error = 'error'
}

export interface UpdatePlayerQuestMessage {
  type: MessageType.UpdatePlayerQuest;
  playerQuest: PlayerQuest; // Assuming PlayerQuest is already defined
}

export interface UpdatedPlayerQuestMessage {
  playerQuest: PlayerQuest;
  type: MessageType.UpdatedPlayerQuest;
  user: ChannelUser;
}

export interface CreateChannelMessage {
  type: MessageType.CreateChannel;
  url: string;  // Url where the lobby is hosted
  questId: string;
}

export interface ChannelCreatedMessage {
  type: MessageType.ChannelCreated;
  channelId: string;
  url: string;          // Url where the lobby is hosted
  users: ChannelUser[];
}

export interface CloseChannelMessage {
  type: MessageType.CloseChannel;
  channelId: string;
}

export interface ChannelClosedMessage {
  type: MessageType.ChannelClosed;
}

export interface JoinChannelMessage {
  type: MessageType.JoinChannel;
  channelId: string;
}

export interface JoinedChannelMessage {
  type: MessageType.JoinedChannel;
  channelId: string;
  newUser?: ChannelUser;
  users: ChannelUser[];
  url: string;          // Url where the lobby is hosted
}

export interface LeaveChannelMessage {
  type: MessageType.LeaveChannel;
  channelId: string;
}

export interface UserLeftChannelMessage {
  type: MessageType.UserLeftChannel;
  channelId: string;
  users: ChannelUser[];
  url: string;          // Url where the lobby is hosted
}

export interface ErrorMessage {
  type: MessageType.Error;
  message: string;
}

export interface ClaimMembershipMessage {
  type: MessageType.ClaimMembership;
  id: string;
}

export interface MembershipClaimedMessage {
  type: MessageType.MembershipClaimed;
}

export type Message = UpdatePlayerQuestMessage |
  UpdatedPlayerQuestMessage |
  CreateChannelMessage |
  JoinChannelMessage |
  ChannelCreatedMessage |
  JoinedChannelMessage |
  ErrorMessage |
  CloseChannelMessage |
  ChannelClosedMessage |
  LeaveChannelMessage |
  UserLeftChannelMessage |
  ClaimMembershipMessage |
  MembershipClaimedMessage