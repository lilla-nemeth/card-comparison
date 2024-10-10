import { PlayerAchievementModel } from '../models/playerAchievementModel';
import { AchievementModel } from '../models/achievementModel';

async function createPlayerAchievements(playerId: string) {
  try {
    const achievements = await AchievementModel.find();

    // Find existing player achievements to avoid duplicates
    const existingPlayerAchievements = await PlayerAchievementModel.find({ playerId });

    // Get a set of achievement IDs that the player already has
    const existingAchievementIds = new Set(existingPlayerAchievements.map(pa => pa.achievement.toString()));

    const playerAchievements = achievements
      .filter(achievement => !existingAchievementIds.has(achievement._id.toString()))
      .map(achievement => ({
        playerId,
        achievement: achievement._id,
        progress: {
          currentCount: 0,
          completed: false,
        }
      }));

    await PlayerAchievementModel.insertMany(playerAchievements);
  } catch (error) {
    console.error('Error creating player achievements:', error);
  }
}

export { createPlayerAchievements };
