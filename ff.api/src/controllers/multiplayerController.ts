import { Request, Response } from "express";
import Channel from "../models/channelModel";
import { IUser } from "../models/userModel";
import Quest from "../models/questModel";

const getSessionData = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const channel = await Channel
      .findById(id)
      .populate<{ users: IUser[] }>('users')

    if (!channel) {
      return res.status(404).send({ message: 'Session not found' });
    }

    const transformedUsers = channel.users.map(user => {
      const userChannel = user.channels.find(ch => ch.channelId.toString() === channel._id.toString());
      return {
        id: user._id.toString(),
        username: user.username,  // Assuming the user schema has a 'username' field
        color: userChannel ? userChannel.color : null,
        role: userChannel ? userChannel.role : null
      };
    });

    const quest = await Quest
      .findById(channel.questId)
      .populate({ path: 'recipe', select: 'name description media' })
      .select('name media')

    res.json({ ...channel.toObject(), users: transformedUsers, quest });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
};

export { getSessionData };
