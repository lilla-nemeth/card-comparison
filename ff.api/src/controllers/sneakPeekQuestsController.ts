import { Request, Response } from "express";

import SneakPeekQuests from "../models/sneakPeakQuestsModel";

export const getSneakPeekQuests = async (req: Request, res: Response) => {
  const { url } = req.params;
  try {
    const sneakPeakQuest = await SneakPeekQuests
      .findOne({ url })
      .populate({
        path: 'quests.quest',
        model: 'Quest',
        populate: {
          path: 'recipe',
          model: 'Recipe'
        }
      })
    if (!sneakPeakQuest) {
      return res.status(404).json({ message: 'Sneak peek not found' });
    }

    res.status(200).json(sneakPeakQuest);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sneak peek", error });
  }
};
