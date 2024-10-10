import request from 'supertest';
import app from "../../app";
import { Achievement, AchievementModel } from '../../models/achievementModel';
import { createAnyAchievements, createNewTestUser } from '../helpers/testData';

describe('Achievement Controller', () => {
  let authToken: string;
  let subAchievement: Achievement;
  let achievementWithSub: Achievement;
  let mainAchievement: Achievement;
  let achievementWithoutRequirements: Achievement;

  beforeEach(async () => {
    const { token } = await createNewTestUser();
    authToken = token;

    // Create a subAchievement
    subAchievement = await createAnyAchievements();
    subAchievement.name = "This is a sub achievement"
    await subAchievement.save();

    // Create an achievement with a subAchievement
    achievementWithSub = await createAnyAchievements();
    achievementWithSub.name = "This is main achievement with subach"
    achievementWithSub.subAchievements = [subAchievement.id];
    await achievementWithSub.save();

    // Create a main achievement without subAchievements
    mainAchievement = await createAnyAchievements();
    mainAchievement.name = "this is main achievement without subs"
    await mainAchievement.save();

    // Create an achievement without requirements but with a subAchievement
    achievementWithoutRequirements = await createAnyAchievements();
    achievementWithoutRequirements.name = "This is main achievement without requirement, but with sub ach"
    achievementWithoutRequirements.requirement = undefined;
    achievementWithoutRequirements.subAchievements = [subAchievement.id];
    await achievementWithoutRequirements.save();
  });

  it('should retrieve all main/parent achievements', async () => {
    const response = await request(app)
      .get('/v1/achievements')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveLength(4);

    // Extracting achievements from the response
    const achievements: Achievement[] = response.body;

    // Check the main achievement
    const mainAchievementFromJSON = achievements.find(a => a._id === mainAchievement._id.toString());
    expect(mainAchievementFromJSON).toBeDefined();
    expect(mainAchievementFromJSON?.name).toBe(mainAchievement.name);
    expect(mainAchievementFromJSON?.description).toBe(mainAchievement.description);
    expect(mainAchievementFromJSON?.size).toBe(mainAchievement.size);
    expect(mainAchievementFromJSON?.subAchievements).toHaveLength(0);

    // Check the achievement with subAchievements
    const achievementWithSubFromJSON = achievements.find(a => a._id === achievementWithSub._id.toString());
    const subAchievement1 = (achievementWithSubFromJSON!.subAchievements as Achievement[])[0] as unknown as Achievement
    expect(achievementWithSubFromJSON).toBeDefined();
    expect(achievementWithSubFromJSON?.name).toBe(achievementWithSub.name);
    expect(achievementWithSubFromJSON?.description).toBe(achievementWithSub.description);
    expect(achievementWithSubFromJSON?.size).toBe(achievementWithSub.size);
    expect(achievementWithSubFromJSON?.subAchievements).toHaveLength(1);
    expect(subAchievement1._id).toBe(subAchievement._id.toString());
    expect(subAchievement1.name).toBe(subAchievement.name);
    expect(subAchievement1.description).toBe(subAchievement.description);
    expect(subAchievement1.size).toBe(subAchievement.size);

    // Check the achievement without requirements
    const achievementWithoutReqFromJSON = achievements.find(a => a._id === achievementWithoutRequirements._id.toString());
    expect(achievementWithoutReqFromJSON).toBeDefined();
    expect(achievementWithoutReqFromJSON?.name).toBe(achievementWithoutRequirements.name);
    expect(achievementWithoutReqFromJSON?.description).toBe(achievementWithoutRequirements.description);
    expect(achievementWithoutReqFromJSON?.size).toBe(achievementWithoutRequirements.size);
    expect(achievementWithoutReqFromJSON?.subAchievements).toHaveLength(1);
  });
});
