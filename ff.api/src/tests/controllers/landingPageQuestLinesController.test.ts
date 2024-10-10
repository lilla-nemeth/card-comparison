import request from "supertest";
import app from "../../app"
import { createTestData, createAchievementsForQuest } from "../helpers/testData";
import LandingPageQuestLines from "../../models/landingPageQuestLinesModel";
import Quest from "../../models/questModel";
import { AchievementModel, AchievementSize } from "../../models/achievementModel";
import Recipe from "../../models/recipeModel";
import Skill from "../../models/skillModel";

describe("LandingPageQuestLines controller", () => {

  beforeAll(() => {
    createTestData()
  })

  describe("GET /api/landing-page-questlines/alien", () => {
    it("Should return all relevant alien quests", async () => {
      const skill1 = new Skill({ name: 'Skill 1', challenge_rating: 1, skill_category: 'Category 1', difficulty_level: 'Easy' });
      const recipe = new Recipe({
        ingredients: [{ name: 'Ingredient 1', quantity: '1', unit: 'unit' }],
        name: 'Recipe 1',
        steps: [
          { attachable: true, text: 'Step 1', skills: [skill1._id] },
        ],
        description: 'Description 1'
      });
      await recipe.save();
      const quest = new Quest({ name: 'Quest A', recipe: recipe._id });
      await quest.save();

      const firstAchievement = await createAchievementsForQuest(quest!.id)
      const secondAchievement = await createAchievementsForQuest(quest!.id)
      const megaAchievement = new AchievementModel({
        name: `Questline type achievement`,
        description: `Get your dream chef hat!`,
        size: AchievementSize.mega,
        subAchievements: [firstAchievement, secondAchievement]
      })
      await megaAchievement.save()

      const alienPageQuests = new LandingPageQuestLines({
        url: "alien",
        achievements: [megaAchievement]
      })
      await alienPageQuests.save()

      const response = await request(app).get('/v1/landing-page-questlines/alien')
      expect(response.status).toBe(200)
    })
  })
});
