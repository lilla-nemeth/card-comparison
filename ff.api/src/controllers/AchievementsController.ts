import { Request, Response } from "express";
import { AchievementModel } from "../models/achievementModel";

export const getAchievements = async (req: Request, res: Response) => {
  try {
    // Let's find AchievementModel which match:
    // $lookup: left outer join to achievements collection. Looks _id of current document if it's present
    // in subAchievements array
    // $match: filter documents which have empty "parent" array -> not as subachievement of other ach
    // $project: exclude generated parent field from output
    const parentAchievements = await AchievementModel.aggregate([
      {
        $lookup: {
          from: 'achievements',
          localField: '_id',
          foreignField: 'subAchievements',
          as: 'parent'
        }
      }
    ]);
    const populated = await AchievementModel
      .populate(parentAchievements, [{ path: "subAchievements", model: "Achievement" }])
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};