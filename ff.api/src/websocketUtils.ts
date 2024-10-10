import WebSocket from 'ws';
import { IUser } from './models/userModel';
import Channel from './models/channelModel';

export const webSocketMap = new Map<string, WebSocket>();

export const broadcastToChannel = async (channelId: string, message: string, sender: IUser) => {
  const channel = await Channel.findById(channelId).populate('users');
  if (channel) {
    channel.users.forEach(async (user) => {
      const userWebSocket = webSocketMap.get(user.id.toString());
      if (userWebSocket && userWebSocket.readyState === WebSocket.OPEN) {
        userWebSocket.send(message);
      }
    });
  }
};
