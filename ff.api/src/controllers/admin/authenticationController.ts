import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AdminUser from "../../models/adminUserModel";

const authenticateAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password }: { username: string, password: string } = req.body;

    const user = await AdminUser.findOne({ username })
    if (!user) {
      return res.status(404).send();
    }

    const isMatch = await user!.comparePassword(password)
    if (!isMatch) {
      return res.status(404).send();
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.VITE_JWT_SECRET!,
      { expiresIn: "4d" }
    );

    res.json({ status: "ok", token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { authenticateAdmin };
