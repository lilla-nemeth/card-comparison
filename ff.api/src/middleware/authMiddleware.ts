import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from the authorization header
  const authHeader = req.headers.authorization;
  // Correctly extract the token from the Authorization header
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).send({ message: "Unauthorized: No token provided" }); // If no token is present, return unauthorized
    return
  }

  jwt.verify(token, process.env.VITE_JWT_SECRET ?? "", (err, decoded) => {
    if (err) {
      const expiredToken = err instanceof jwt.TokenExpiredError
      res
        .status(expiredToken ? 401 : 403)
        .send({ message: "Token verification failed.", error: err.message }); // Forbidden if error occurs during token verification
      return
    }
    req.user = decoded as { id: string; username: string; iat?: number; exp?: number };
    next(); // Proceed to the next middleware/function if token is valid
  });
};

export default authMiddleware;
