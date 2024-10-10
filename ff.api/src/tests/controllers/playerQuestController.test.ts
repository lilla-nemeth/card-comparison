import request from "supertest";
import app from "../../app"
import { Types } from "mongoose";

import PlayerQuest, { IPlayerQuest, PlayerQuestState, StepState } from '../../models/playerQuestModel';
import { IUser } from "../../models/userModel";
import { createTestData, createNewTestUser } from '../helpers/testData';
import Quest from "../../models/questModel";
import { IRecipe } from "../../models/recipeModel";
import * as playerService from '../../services/playerAchievementService'; // Adjust the path to your playerService file
import { AchievementType } from "../../models/achievementModel";
import { UserGroupModel } from "../../models/userGroupSchema";

describe("PlayerQuest controller", () => {

  let token: string;
  let user: IUser;
  let playerQuest: IPlayerQuest;

  beforeEach(async () => {
    const data = await createTestData()
    token = data.token
    user = data.user
    playerQuest = data.playerQuest
  })

  describe("GET /api/playerQuest", () => {
    it("Should return all of current player quests", async () => {
      const response = await request(app)
        .get('/v1/playerQuests/me')
        .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(200)

      const populated = await playerQuest.populate<{ recipe: IRecipe }>
        ({
          path: 'recipe',
          model: 'Recipe',
          populate: {
            path: 'steps',
            model: 'Step'
          }
        })

      response.body.forEach((pQuest: IPlayerQuest) => {
        expect(pQuest).toMatchObject({
          users: [user.id],
          state: PlayerQuestState.inProgress,
          _id: populated._id.toString(),
          name: populated.name,
          recipe: {
            name: populated.recipe.name
          }
        })
      });
    })
  })

  describe("GET /api/playerQuest", () => {
    it("Should return empty list for current player quests", async () => {
      const data = await createNewTestUser()
      const response = await request(app)
        .get('/v1/playerQuests/me')
        .set('Authorization', `Bearer ${data.token}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(0)
    })
  })

  describe("GET /api/playerQuest/:id", () => {
    it("Should return certain player quest with valid id", async () => {
      const response = await request(app)
        .get(`/v1/playerQuests/${playerQuest.id}`)
        .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(200)

      const populated = await playerQuest.populate<{ recipe: IRecipe }>
        ({
          path: 'recipe',
          model: 'Recipe',
          populate: {
            path: 'steps',
            model: 'Step'
          }
        })

      expect(response.body).toMatchObject({
        users: [user.id],
        state: PlayerQuestState.inProgress,
        _id: populated._id.toString(),
        name: populated.name,
        recipe: {
          name: populated.recipe.name
        }
      })
    })

    it("Should return error with invalid id", async () => {
      const id = new Types.ObjectId()
      const response = await request(app)
        .get(`/v1/playerQuests/${id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(404)
    })
  })

  describe("POST /api/playerQuests", () => {
    it("Should create new PlayerQuest", async () => {
      const data = await createNewTestUser()
      const userGroup = new UserGroupModel({
        name: 'Test Group',
        members: [data.user]
      });
      await userGroup.save();
      data.user.activeUserGroup = userGroup.id;
      await data.user.save();

      const quest = await Quest.findOne().populate<{ recipe: IRecipe }>('recipe').exec()
      const response = await request(app)
        .post('/v1/playerQuests/')
        .set('Authorization', `Bearer ${data.token}`)
        .send({ id: quest!.id });

      expect(response.status).toBe(200);
      expect(response.body.state).toEqual(PlayerQuestState.inProgress)
      expect(response.body.recipe.steps[0].state).toEqual(StepState.notStarted)
      expect(response.body.recipe.steps[0].text).toEqual(quest!.recipe.steps[0].text)
      expect(response.body.name).toEqual(quest!.name)
      expect(response.body.recipe.name).toEqual(quest!.recipe.name)
    });
  })

  describe("PATCH /api/playerQuests/:id", () => {
    it("Should update player quest progress and mark as completed when all steps are done", async () => {

      const populated = await playerQuest.populate<{ recipe: IRecipe }>
        ({
          path: 'recipe',
          model: 'Recipe',
          populate: {
            path: 'steps',
            model: 'Step'
          }
        })

      const response1 = await request(app)
        .patch(`/v1/playerQuests/${populated.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ stepId: populated.recipe.steps[0]._id.toString(), state: StepState.completed });

      expect(response1.status).toBe(200);
      expect(response1.body.recipe.steps[0].state).toEqual(StepState.completed);
      expect(response1.body.state).toEqual(PlayerQuestState.inProgress);

      // Complete the second step
      const response2 = await request(app)
        .patch(`/v1/playerQuests/${populated.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ stepId: populated.recipe.steps[1]._id.toString() });

      expect(response2.status).toBe(200);
      expect(response2.body.recipe.steps[1].state).toEqual(StepState.completed)
      expect(response2.body.state).toEqual(PlayerQuestState.completed);

      const updatedPlayerQuest = await PlayerQuest.findById(response2.body._id).exec();
      expect(updatedPlayerQuest!.state).toBe(PlayerQuestState.completed);
    });
  })

  describe("PATCH /api/playerQuests/:id/:stepId/claim", () => {
    it("Should update player quest step's claimBy", async () => {

      const populated = await playerQuest.populate<{ recipe: IRecipe }>
        ({
          path: 'recipe',
          model: 'Recipe',
          populate: {
            path: 'steps',
            model: 'Step'
          }
        })

      const response1 = await request(app)
        .patch(`/v1/playerQuests/${populated.id}/${populated.recipe.steps[0]._id.toString()}/claim`)
        .set('Authorization', `Bearer ${token}`);

      expect(response1.status).toBe(200);
      expect(response1.body.recipe.steps[0].claimedBy.id).toEqual(user.id);
    });
  })
});