import WebSocket from 'ws';
import User, { IUser, ChannelUserRole, randomPlayerColor, UserColors } from './models/userModel';
import Channel, { IChannel } from './models/channelModel';
import { broadcastToChannel } from './websocketUtils';

export const createChannel = async (ws: WebSocket, url: string, questId: string): Promise<string> => {
  const user = (ws as any).user as IUser;
  if (user) {
    const channel = new Channel({ url, questId, users: [], userGroup: user.activeUserGroup });
    await channel.save();

    user.channels.push({ channelId: channel._id, role: ChannelUserRole.Host, color: UserColors.blue });
    await user.save();

    channel.users.push(user._id);
    await channel.save();

    return channel._id.toString();
  }
  return "";
};

export const joinChannel = async (ws: WebSocket, channelId: string): Promise<IChannel | null> => {
  const channel = await Channel.findById(channelId).populate('users');
  const user = (ws as any).user as IUser;
  if (channel && user) {
    let userChannel = user.channels.find(ch => ch.channelId.toString() === channelId);

    if (!userChannel) {
      const role = ChannelUserRole.Member;
      const color = randomPlayerColor();

      userChannel = { channelId: channel._id, role, color };
      user.channels.push(userChannel);
      await user.save();
    }

    if (!channel.users.some((u) => u.id === user.id)) {
      channel.users.push(user.id);
      await channel.save();
    }

    const databaseUser = await User.findById(user.id);
    if (databaseUser) {
      databaseUser.activeUserGroup = channel.userGroup;
      await databaseUser.save();
    }

    const subSetUser = {
      id: user._id,
      color: userChannel.color,
      username: user.username,
      role: userChannel.role,
    };

    broadcastToChannel(channelId, JSON.stringify({ type: 'userJoined', user: subSetUser }), user);
    return channel;
  }
  return null;
};

export const getUsersInChannel = async (channelId: string): Promise<{ id: string, username: string, role?: string, color?: string }[]> => {
  const channel = await Channel.findById(channelId).populate<{ users: IUser[] }>({ path: 'users', select: 'id username channels' });
  if (channel) {
    return channel.users.map(user => {
      const userChannel = user.channels.find(ch => ch.channelId.toString() === channelId);
      return {
        id: user._id.toString(),
        username: user.username,
        role: userChannel?.role,
        color: userChannel?.color,
      };
    });
  }
  return [];
};
