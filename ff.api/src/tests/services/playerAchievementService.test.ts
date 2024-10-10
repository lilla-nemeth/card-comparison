import { Types } from 'mongoose';
import { createPlayerAchievements } from '../../services/playerAchievementService';
import { AchievementModel, AchievementType } from '../../models/achievementModel';
import { PlayerAchievementModel } from '../../models/playerAchievementModel';
import { createAnyAchievements, createAchievementsForStep, createNewTestUser } from '../helpers/testData';

describe("PlayerService object", () => {

  beforeEach(async () => {
    await PlayerAchievementModel.deleteMany()
    await AchievementModel.deleteMany({});
  })

  describe("createPlayerAchievements", () => {

    it("creates PlayerAchievements for a new player", async () => {
      const { user } = await createNewTestUser();
      const stepId = "step1";
      const achievement = await createAchievementsForStep(stepId, 2);

      await createPlayerAchievements(user.id);

      const playerAchievements = await PlayerAchievementModel.find({ playerId: user.id });
      expect(playerAchievements).toHaveLength(1);
      expect(playerAchievements[0].achievement).toEqual(achievement._id);
    });

    it("handles no achievements available", async () => {
      const { user } = await createNewTestUser();

      await createPlayerAchievements(user.id);

      const playerAchievements = await PlayerAchievementModel.find({ playerId: user.id });
      expect(playerAchievements).toHaveLength(0);
    });

    it("does not create duplicate achievements for the same player", async () => {
      const { user } = await createNewTestUser();
      const stepId = "step1";
      const achievement = await createAchievementsForStep(stepId, 2);

      await createPlayerAchievements(user.id);
      await createPlayerAchievements(user.id);

      const playerAchievements = await PlayerAchievementModel.find({ playerId: user.id });
      expect(playerAchievements).toHaveLength(1); // Should not create duplicates
    });

    it("initializes progress correctly for PlayerAchievements", async () => {
      const { user } = await createNewTestUser();
      const stepId = "step1";
      const achievement = await createAchievementsForStep(stepId, 2);

      await createPlayerAchievements(user.id);

      const playerAchievements = await PlayerAchievementModel.find({ playerId: user.id });
      expect(playerAchievements).toHaveLength(1);
      const progress = playerAchievements[0].progress;
      expect(progress?.currentCount).toBe(0);
      expect(progress?.completed).toBe(false);
    });

  });
})