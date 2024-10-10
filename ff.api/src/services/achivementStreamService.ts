import mongoose from 'mongoose';
import { IUser } from '../models/userModel';
import { PlayerAchievementModel } from '../models/playerAchievementModel';
import { AchievementModel } from '../models/achievementModel';

async function createPlayerAchievementsForNewAchievement(achievementId: string) {
  try {
    // const achievement = await AchievementModel.findById(achievementId);
    // if (!achievement) {
    //   throw new Error('Achievement not found');
    // }

    // const players = await PlayerModel.find();

    // const playerAchievementBulkOps = [];
    // for (const player of players) {
    //   const existingAchievement = await PlayerAchievementModel.findOne({
    //     playerId: player._id,
    //     achievement: achievement._id,
    //   });

    //   if (!existingAchievement) {
    //     const playerAchievement = {
    //       playerId: player._id,
    //       achievement: achievement._id,
    //       progress: achievement.requirements.map(req => ({
    //         requirementId: req._id,
    //         currentCount: 0,
    //         completed: false,
    //         targetCount: req.targetCount
    //       }))
    //     };

    //     playerAchievementBulkOps.push({
    //       insertOne: {
    //         document: playerAchievement
    //       }
    //     });
    //   }
    // }

    // if (playerAchievementBulkOps.length > 0) {
    //   await PlayerAchievementModel.bulkWrite(playerAchievementBulkOps);
    //   console.log(`Player achievements created for new achievement: ${achievementId}`);
    // }
  } catch (error) {
    console.error('Error creating player achievements for new achievement:', error);
  }
}

export function watchAchievementChanges() {
  // const watcher = AchievementModel.watch()
  // watcher.on('change', async (change) => {
  //   console.log('change', change)
  //   if (change.operationType === 'insert') {

  //   }
  // })
  // const achievementCollection = mongoose.connection.collection('achievements');

  // const changeStream = achievementCollection.watch();

  // changeStream.on('change', async (change) => {
  //   if (change.operationType === 'insert') {
  //     const achievementId = change.fullDocument._id;
  //     await createPlayerAchievementsForNewAchievement(achievementId);
  //   }
  // });

  console.log('Watching for changes in achievements collection...');
}
