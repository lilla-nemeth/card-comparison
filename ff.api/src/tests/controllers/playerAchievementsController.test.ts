import request from 'supertest';
import app from "../../app";
import { PlayerAchievementModel } from '../../models/playerAchievementModel';
import { Achievement, AchievementType, AchievementModel, AchievementSize } from '../../models/achievementModel';
import Skill from '../../models/skillModel';
import Recipe from '../../models/recipeModel';
import QuestTag from '../../models/questTagModel';
import Quest from '../../models/questModel';
import { createAnyAchievements, createNewTestUser, createAchievementsForStep } from '../helpers/testData';

describe('PlayerAchievement Controller', () => {
  let authToken: string;
  let userId: string;
  let playerAchievementId: string;
  let playerMegaAchievementId: string;
  let subPlayerAchievementId: string;
  let subAchievement: Achievement;

  beforeEach(async () => {
    await PlayerAchievementModel.deleteMany({});
    await AchievementModel.deleteMany({});
    const { user, token } = await createNewTestUser();
    userId = user.id;
    authToken = token;

    const skillWithAchievement = new Skill({ name: 'Skill 1', challenge_rating: 1, skill_category: 'Category 1', difficulty_level: 'Easy' });
    await skillWithAchievement.save();

    const skillWithoutAchievement = new Skill({ name: 'Skill 2', challenge_rating: 1, skill_category: 'Category 1', difficulty_level: 'Easy' });
    await skillWithoutAchievement.save();

    const recipeWithSkillWithAchievement = new Recipe({
      ingredients: [{ name: 'Ingredient 1', quantity: '1', unit: 'unit' }],
      name: 'Recipe 1',
      steps: [
        { attachable: true, text: 'Step 1', skills: [skillWithAchievement._id] },
        { attachable: true, text: 'Step 2', skills: [skillWithoutAchievement._id] },
      ],
      description: 'Description 1'
    });
    await recipeWithSkillWithAchievement.save();

    const recipeWithoutAchievement = new Recipe({
      ingredients: [{ name: 'Ingredient 1', quantity: '1', unit: 'unit' }],
      name: 'Recipe 2',
      steps: [
        { attachable: true, text: 'Step 2', skills: [skillWithoutAchievement._id] },
      ],
      description: 'Description 2'
    });
    await recipeWithoutAchievement.save();

    const tag = new QuestTag({ title: 'Italian' })
    await tag.save();

    const questWithSkillRecipe = new Quest({ tags: [tag.id], name: 'Quest A', recipe: recipeWithSkillWithAchievement._id });
    await questWithSkillRecipe.save();

    const questWithoutAchievement = new Quest({ tags: [tag.id], name: 'Quest B', recipe: recipeWithoutAchievement._id });
    await questWithoutAchievement.save();

    subAchievement = new AchievementModel({
      name: "This is a sub achievement with skill requirement",
      description: "You've finished skill 1!",
      requirement: {
        any: false,
        skillId: skillWithAchievement._id,
        targetCount: 1,
        type: AchievementType.step,
      }
    })
    await subAchievement.save();

    const megaAchievement = new AchievementModel({
      name: "This is mega achievement",
      description: "Unlock all the skill based achievement for this",
      size: AchievementSize.mega,
      subAchievements: [subAchievement.id]
    })
    await megaAchievement.save();
    const playerMegaAchievement = new PlayerAchievementModel({
      playerId: userId,
      achievement: megaAchievement._id,
      progress: {
        currentCount: 0,
        completed: false,
      }
    });
    await playerMegaAchievement.save();
    playerMegaAchievementId = playerMegaAchievement._id.toString();

    // This data is to test questId based achievement progress
    const questAchievement = await createAchievementsForStep(recipeWithSkillWithAchievement!.steps[0]._id.toString(), 1);
    questAchievement.subAchievements = [subAchievement.id];
    await questAchievement.save();

    const playerAchievement = new PlayerAchievementModel({
      playerId: userId,
      achievement: questAchievement._id,
      progress: {
        currentCount: 0,
        completed: false,
      }
    });
    await playerAchievement.save();
    playerAchievementId = playerAchievement._id.toString();

    const subPlayerAchievement = new PlayerAchievementModel({
      playerId: userId,
      achievement: subAchievement._id,
      progress: {
        currentCount: 0,
        completed: false,
      }
    });
    await subPlayerAchievement.save();

    subPlayerAchievementId = subPlayerAchievement._id.toString();
  });

  it('should retrieve the current user achievements', async () => {
    const response = await request(app)
      .get('/v1/playerAchievements/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveLength(3);
    expect(response.body[0]._id).toEqual(playerMegaAchievementId);
  });

  it('should return an empty array if the user has no achievements', async () => {
    await AchievementModel.deleteMany({});
    await PlayerAchievementModel.deleteMany({});

    const response = await request(app)
      .get('/v1/playerAchievements/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveLength(0);
  });

  it('should handle server errors gracefully', async () => {
    jest.spyOn(PlayerAchievementModel, 'find').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    const response = await request(app)
      .get('/v1/playerAchievements/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(500);

    expect(response.body).toHaveProperty('message', 'Server error');
  });

  it('should update player achievement progress successfully', async () => {
    const response = await request(app)
      .patch(`/v1/playerAchievements/${playerAchievementId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        currentCount: 1,
        completed: true,
        questId: 'quest1',
        unlockedAt: new Date().toISOString()
      })
      .expect(200);

    expect(response.body.progress.currentCount).toEqual(1);
    expect(response.body.progress.completed).toEqual(true);
    expect(response.body.questId).toEqual('quest1');
    expect(new Date(response.body.unlockedAt)).toBeTruthy();
  });

  it('should handle updating non-existent player achievement', async () => {
    const response = await request(app)
      .patch('/v1/playerAchievements/nonexistentid')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        currentCount: 1,
        completed: true,
        questId: 'quest1',
        unlockedAt: new Date().toISOString()
      })
      .expect(400);
    expect(response.body).toHaveProperty('message', 'Invalid player achievement ID');
  });

  it('should handle server errors on update gracefully', async () => {
    jest.spyOn(PlayerAchievementModel.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    const response = await request(app)
      .patch(`/v1/playerAchievements/${playerAchievementId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        currentCount: 1,
        completed: true,
        questId: 'quest1',
        unlockedAt: new Date().toISOString()
      })
      .expect(500);

    expect(response.body).toHaveProperty('message', 'Server error');
  });

  it('should return player achievement model and progress quests for each achievements', async () => {
    const response = await request(app)
      .get(`/v1/playerAchievements/${playerMegaAchievementId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // Verify that the response contains the main player achievement
    expect(response.body).toHaveProperty('mainPlayerAchievement');
    expect(response.body.mainPlayerAchievement._id).toEqual(playerMegaAchievementId);

    // Verify that the response contains sub player achievements
    expect(response.body).toHaveProperty('subPlayerAchievements');
    expect(response.body.subPlayerAchievements).toBeInstanceOf(Array);
    expect(response.body.subPlayerAchievements).toHaveLength(1);

    // Check the sub player achievement details
    const subPlayerAchievement = response.body.subPlayerAchievements[0];
    expect(subPlayerAchievement.achievement.name).toBe(subAchievement.name);
    expect(subPlayerAchievement).toHaveProperty('progressQuests');
    expect(subPlayerAchievement.progressQuests).toBeInstanceOf(Array);
    expect(subPlayerAchievement.progressQuests).toHaveLength(1);
  });
});
