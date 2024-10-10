import { IUser } from "./userModel";

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
  playerQuest: string;
}

export interface UpdatedPlayerQuestMessage {
  type: MessageType.UpdatedPlayerQuest;
  user: IUser;
  playerQuest: string;
}

export interface CreateChannelMessage {
  type: MessageType.CreateChannel;
  url: string;
  questId: string;
}

export interface CloseChannelMessage {
  type: MessageType.CloseChannel;
  channelId: string;
}

export interface JoinChannelMessage {
  type: MessageType.JoinChannel;
  channelId: string;
}

export interface LeaveChannelMessage {
  type: MessageType.LeaveChannel;
  channelId: string;
}

export interface ClaimMembershipMessage {
  type: MessageType.ClaimMembership;
  id: string;
}

export type Message = UpdatePlayerQuestMessage |
  CreateChannelMessage |
  JoinChannelMessage |
  UpdatedPlayerQuestMessage |
  CloseChannelMessage |
  LeaveChannelMessage |
  ClaimMembershipMessage