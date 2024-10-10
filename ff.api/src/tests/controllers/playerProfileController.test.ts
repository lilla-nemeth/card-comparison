import request from 'supertest';
import app from '../../app';
import { Types } from "mongoose";
import User, { IUser } from '../../models/userModel';
import { PlayerAchievement } from '../../models/playerAchievementModel';
import { createTestData, createAnyAchievements, createPlayerAchievements } from '../helpers/testData';

describe('PlayerProfile controller', () => {
  let token: string;
  let user: IUser;

  beforeEach(async () => {
    const data = await createTestData();
    token = data.token;
    user = data.user;
  });

  describe('GET /v1/players/me/profile', () => {
    it('Should return profile of current player without trackedPlayerAchievement', async () => {
      const response = await request(app)
        .get('/v1/players/me/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.trackedPlayerAchievement).toBeUndefined();
    });

    it('Should return profile of current player with trackedPlayerAchievement', async () => {
      const achievement = await createAnyAchievements();
      const playerAchievement = await createPlayerAchievements(user.id, achievement);
      user.trackedPlayerAchievements = [playerAchievement._id];
      await user.save();

      const response = await request(app)
        .get('/v1/players/me/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.trackedPlayerAchievements).toBeDefined();
      expect(response.body.trackedPlayerAchievements[0]._id).toEqual(playerAchievement._id.toString());
    });
  });

  describe('PATCH /v1/players/me/profile', () => {
    it('Should update the trackedPlayerAchievement of the current player', async () => {
      const achievement = await createAnyAchievements();
      const newPlayerAchievement = await createPlayerAchievements(user.id, achievement);
      const secondNewPlayerAchievement = await createPlayerAchievements(user.id, achievement);

      const response = await request(app)
        .patch('/v1/players/me/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ tpaId: newPlayerAchievement.id });

      expect(response.status).toBe(200);
      expect(response.body.trackedPlayerAchievements).toBeDefined();
      expect(response.body.trackedPlayerAchievements[0]._id).toEqual(newPlayerAchievement._id.toString());

      const updateResponse = await request(app)
        .patch('/v1/players/me/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ tpaId: secondNewPlayerAchievement.id });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.trackedPlayerAchievements).toBeDefined();
      expect(updateResponse.body.trackedPlayerAchievements[1]._id).toEqual(secondNewPlayerAchievement._id.toString());
    });

    it('Should return 404 if user is not found', async () => {
      const achievement = await createAnyAchievements();
      const newPlayerAchievement = await createPlayerAchievements(user._id, achievement);
      await User.deleteMany({})

      const response = await request(app)
        .patch('/v1/players/me/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ tpaId: newPlayerAchievement._id });

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('User not found');
    });

    it('Should return 403 if trackedPlayerAchievement does not belong to the current user', async () => {
      const achievement = await createAnyAchievements();
      const newPlayerAchievement = await createPlayerAchievements(new Types.ObjectId().toString(), achievement);

      const response = await request(app)
        .patch('/v1/players/me/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ tpaId: newPlayerAchievement._id });

      expect(response.status).toBe(404);
    });

    it('Should return 404 if playerAchievement is not found', async () => {
      const nonExistentId = new Types.ObjectId().toString();

      const response = await request(app)
        .patch('/v1/players/me/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ tpaId: nonExistentId });

      expect(response.status).toBe(404);
    });
  });
});
