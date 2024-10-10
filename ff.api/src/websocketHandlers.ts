import WebSocket from 'ws';
import { webSocketMap, broadcastToChannel } from './websocketUtils';
import { createChannel, joinChannel, getUsersInChannel } from './channelHandlers';
import { MessageType, Message } from './models/socketMessages';
import Channel from './models/channelModel';
import { GroupMembershipModel } from './models/userGroupMembershipModel';
import User, { IUser } from './models/userModel';

export const handleWebSocketConnection = (ws: WebSocket, req: any) => {
  const user = (req as any).user as IUser;
  (ws as any).user = user;
  webSocketMap.set(user._id.toString(), ws);

  let currentChannelId: string | null = null;
  ws.on('message', async (rawData: WebSocket.RawData) => {
    try {
      const message: Message = JSON.parse(rawData.toString())
      switch (message.type) {
        case MessageType.CreateChannel:
          currentChannelId = await createChannel(ws, message.url, message.questId);
          ws.send(JSON.stringify({
            type: 'channelCreated',
            channelId: currentChannelId,
            users: await getUsersInChannel(currentChannelId)
          }));
          break;
        case MessageType.JoinChannel:
          currentChannelId = message.channelId;
          const joinedChannelAlready = await Channel.exists({ _id: currentChannelId, users: user.id })
          const newUser = joinedChannelAlready ? null : user
          const joinedChannel = await joinChannel(ws, currentChannelId!)
          const users = await getUsersInChannel(currentChannelId)
          if (joinedChannel) {
            const msg = JSON.stringify({
              type: 'joinedChannel',
              channelId: currentChannelId,
              newUser,
              users,
              url: joinedChannel.url
            })
            broadcastToChannel(currentChannelId!, msg, user)
          } else {
            ws.send(JSON.stringify({ type: 'error', message: 'Channel not found' }));
          }
          break;
        case MessageType.LeaveChannel:
          const channelId = message.channelId;
          const userChannel = await Channel.findById(channelId);

          if (userChannel) {
            // Remove the user from the channel's users array
            userChannel.users = userChannel.users.filter(userId => userId.toString() !== user._id.toString());

            // Remove the channel from the user's channels array
            user.channels = user.channels.filter(ch => ch.channelId.toString() !== channelId);

            await userChannel.save();
            await user.save();

            broadcastToChannel(
              channelId,
              JSON.stringify(
                {
                  type: MessageType.UserLeftChannel,
                  users: await getUsersInChannel(channelId)
                }
              ),
              user);
          }
          break;
        case MessageType.UpdatePlayerQuest:
          if (currentChannelId) {
            broadcastToChannel(
              currentChannelId, JSON.stringify({
                type: MessageType.UpdatedPlayerQuest,
                user: user,
                playerQuest: message.playerQuest
              }),
              user);
          }
          break;
        case MessageType.ClaimMembership:
          const membership = await GroupMembershipModel.findById(message.id);
          if (!membership) throw new Error('Membership not found');
          // if (membership.userId) throw new Error('Membership already claimed');
          membership.userId = user.id;
          await membership.save();
          if (currentChannelId) {
            broadcastToChannel(
              currentChannelId,
              JSON.stringify({
                type: MessageType.MembershipClaimed
              }),
              user
            )
          }
          break;
        case MessageType.CloseChannel:
          const channel = await Channel.findById(message.channelId);
          if (channel) {
            // Broadcast the channel closed message to all users in the channel
            broadcastToChannel(
              message.channelId,
              JSON.stringify({
                type: MessageType.ChannelClosed
              }),
              user
            );

            channel.users.forEach(async (userId) => {
              const channelUser = await User.findById(userId);
              if (channelUser) {
                channelUser.channels = channelUser.channels.filter(ch => ch.channelId.toString() !== message.channelId);
                await channelUser.save();
              }

              const userWebSocket = webSocketMap.get(userId.toString());
              if (userWebSocket) {
                userWebSocket.close();
                webSocketMap.delete(userId.toString());
              }
            });
            await channel.deleteOne()
          }
          break;
        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown command' }));
          break;
      }
    } catch (err) {
      console.error('failed to process message', err)
    }
  });

  ws.on('close', async () => {
    webSocketMap.delete(user._id.toString());

    if (currentChannelId) {
      const channel = await Channel.findById(currentChannelId);
      if (channel) {
        // TODO: Mark user as disconnected?
        // channel.users = channel.users.filter(userId => userId.toString() !== user._id.toString());
        // await channel.save();

        // // Remove channel from user channels
        // user.channels = user.channels.filter(ch => ch.channelId.toString() !== currentChannelId);
        // await user.save();
      }
    }
  });
};
