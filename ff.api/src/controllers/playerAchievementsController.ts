import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { PlayerAchievement, PlayerAchievementModel } from "../models/playerAchievementModel";
import { Achievement, AchievementModel } from "../models/achievementModel";
import Quest, { IQuest } from "../models/questModel";
import Recipe from "../models/recipeModel";

export const getCurrentUserAchievement = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid player achievement ID' });
    }
    const playerAchievement = await PlayerAchievementModel
      .findById(id)
      .populate(
        {
          path: 'achievement',
          populate: {
            path: 'subAchievements'
          }
        })
      .exec();

    if (!playerAchievement) {
      return res.status(404).json({ message: 'Player achievement not found' });
    }

    const mainAchievement = playerAchievement.achievement;
    const subPlayerAchievements = await Promise.all(mainAchievement.subAchievements.map(async (subAch) => {
      const subAchQuests = await findProgressQuests(subAch);
      const subPlayerAchievement = await PlayerAchievementModel
        .findOne({ achievement: subAch.id })
        .populate({ path: 'achievement' })
      return {
        ...subPlayerAchievement!.toObject(),
        progressQuests: subAchQuests
      };
    }));

    // Construct questLine response
    const questLine = {
      mainPlayerAchievement: playerAchievement,
      subPlayerAchievements: subPlayerAchievements
    };

    return res.json(questLine);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

export const getCurrentUserAchievements = async (req: Request, res: Response) => {
  try {
    // Fetch all achievements
    const allAchievements = await AchievementModel.find().exec();

    // Fetch player achievements for the current user
    const playerAchievements = await PlayerAchievementModel
      .find({ playerId: req.user.id })
      .populate('achievement')
      .exec();

    // Determine which achievements are missing for the player
    const playerAchievementIds = new Set(playerAchievements.map(pa => pa.achievement._id.toString()));
    const missingAchievements = allAchievements.filter(ach => !playerAchievementIds.has(ach._id.toString()));

    // Prepare bulk insert operations for missing player achievements
    const bulkOps = missingAchievements.map(ach => ({
      insertOne: {
        document: {
          playerId: req.user.id,
          achievement: ach._id,
          progress: {
            completed: false,
            currentCount: 0,
            targetCount: ach.requirement?.targetCount || 0
          }
        }
      }
    }));

    // Execute bulk insert operations if there are missing achievements
    if (bulkOps.length > 0) {
      await PlayerAchievementModel.bulkWrite(bulkOps);
    }

    // Fetch the updated list of player achievements
    const updatedPlayerAchievements = await PlayerAchievementModel
      .find({ playerId: req.user.id })
      .populate({
        path: 'achievement',
        model: 'Achievement',
        populate: {
          path: 'subAchievements',
          model: 'Achievement'
        }
      })
      .exec();

    res.json(updatedPlayerAchievements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updatePlayerAchievementProgress = async (req: Request, res: Response) => {
  const { currentCount, completed, questId, unlockedAt } = req.body;
  const { id: playerAchievementId } = req.params;

  if (!Types.ObjectId.isValid(playerAchievementId)) {
    return res.status(400).json({ message: 'Invalid player achievement ID' });
  }

  try {
    // Find the specific PlayerAchievement to update
    const playerAchievement = await PlayerAchievementModel
      .findById(playerAchievementId)
      .populate('achievement');

    if (!playerAchievement) {
      return res.status(404).json({ message: 'Player achievement not found' });
    }

    // Update the progress with provided values if achievement have requirements
    if (playerAchievement.achievement.requirement && playerAchievement.progress) {
      playerAchievement.progress.currentCount = currentCount;
      playerAchievement.progress.completed = completed;
    }

    // Update the player achievement with provided values
    playerAchievement.questId = questId;
    playerAchievement.unlockedAt = unlockedAt;
    playerAchievement.completed = completed;

    await playerAchievement.save();

    return res.json(playerAchievement);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const findProgressQuests = async (achievement: Achievement): Promise<IQuest[]> => {
  const questIds = [];
  const skillIds = [];
  const stepIds = [];

  if (achievement.requirement) {
    if (achievement.requirement.questId) questIds.push(achievement.requirement.questId);
    if (achievement.requirement.skillId) skillIds.push(achievement.requirement.skillId);
    if (achievement.requirement.stepId) stepIds.push(achievement.requirement.stepId);
  }

  const recipes = await Recipe.find({
    $or: [
      { 'steps.skills': { $in: skillIds } },
      { 'steps': { $in: stepIds } }
    ]
  })
  const recipeIds = recipes.map(recipe => recipe._id)

  const quests = await Quest.find({
    $or: [
      { '_id': { $in: questIds } },
      { recipe: { $in: recipeIds } },
    ]
  }).populate({
    path: 'recipe'
  })

  return quests;
};