import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";
import AdminUser from "../models/adminUserModel";

const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Get token from the authorization header
  const authHeader = req.headers.authorization;
  // Correctly extract the token from the Authorization header
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).send({ message: "Unauthorized: No token provided" }); // If no token is present, return unauthorized
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET ?? "") as { id: string; username: string };
    const adminUser = await AdminUser.findById(decoded.id);
    if (!adminUser) {
      return res.status(403).send({ message: "Access denied: Not an admin user" });
    }

    req.user = adminUser;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).send({ message: "Unauthorized: Token has expired" });
    }
    return res.status(403).send({ message: "Forbidden: Token verification failed" });
  }
};

export default adminAuthMiddleware;
