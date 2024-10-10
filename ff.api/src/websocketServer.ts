import WebSocket, { WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import { handleWebSocketConnection } from './websocketHandlers';
import User from './models/userModel';

export const createWebSocketServer = (server: any) => {
  const wss = new WebSocketServer({
    server,
    verifyClient: (info, done) => {
      const urlParams = new URLSearchParams(info.req.url?.split('?')[1]);
      const token = urlParams.get('token');

      if (!token) {
        done(false, 401, 'Unauthorized');
        return;
      }

      jwt.verify(token, process.env.VITE_JWT_SECRET!, async (err, decoded) => {
        if (err) {
          done(false, 401, 'Unauthorized');
          return;
        }

        try {
          const user = await User.findById((decoded as { id: string }).id);
          if (!user) {
            done(false, 401, 'Unauthorized');
            return;
          }

          // Attach user information to the request object
          (info.req as any).user = user;
          done(true);
        } catch (err) {
          done(false, 401, 'Unauthorized');
        }
      })
    }
  });

  wss.on('connection', (ws: WebSocket, req) => handleWebSocketConnection(ws, req));

  return wss;
};
