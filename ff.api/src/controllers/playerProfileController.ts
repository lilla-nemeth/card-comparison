import { Request, Response } from 'express';
import PlayerQuest from '../models/playerQuestModel';
import User from '../models/userModel';
import { PlayerAchievement, PlayerAchievementModel } from '../models/playerAchievementModel';

interface PlayerProfileResponse {
  numberOfPlayedQuests: number;
  trackedPlayerAchievements: PlayerAchievement[];
}

export const getCurrentPlayerProfile = async (req: Request, res: Response) => {
  try {
    const user = await User
      .findById(req.user.id)
      .populate<{ trackedPlayerAchievements: PlayerAchievement[] }>({
        path: 'trackedPlayerAchievements', model: 'PlayerAchievement', populate: {
          path: 'achievement',
          model: 'Achievement'
        }
      });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const { trackedPlayerAchievements } = user;
    const playerQuests = await PlayerQuest.find({ user: req.user.id });
    const numberOfPlayedQuests = playerQuests.length
    const response: PlayerProfileResponse = {
      numberOfPlayedQuests,
      trackedPlayerAchievements
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

export const updateCurrentPlayerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { tpaId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const playerAchievement = await PlayerAchievementModel.findOne({
      _id: tpaId, playerId: user.id
    })
    if (!playerAchievement) {
      res.status(404).json({ message: 'PlayerAchievement not found' });
      return;
    }

    user.trackedPlayerAchievements.push(playerAchievement.id);
    await user.save();

    const updatedUser = await User
      .findById(req.user.id)
      .populate({
        path: 'trackedPlayerAchievements', model: 'PlayerAchievement', populate: {
          path: 'achievement',
          model: 'Achievement'
        }
      });
    res.json(updatedUser!);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};