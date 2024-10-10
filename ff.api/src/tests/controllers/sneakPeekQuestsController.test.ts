import request from "supertest";
import app from "../../app"
import { createTestData } from "../helpers/testData";
import SneakPeekQuests from "../../models/sneakPeakQuestsModel";

describe("LandingPageQuestLines controller", () => {

  describe("GET /api/sneakPeekQuests/alien", () => {
    it("Should return correct sneak peek quests", async () => {
      const { quest } = await createTestData()
      const newQuestPage = new SneakPeekQuests({
        url: 'alien',
        quests: [
          { index: 0, quest: quest!._id },
        ]
      });
      await newQuestPage.save();

      const response = await request(app).get('/v1/sneakPeekQuests/alien')
      expect(response.status).toBe(200)
    })

    it("Should return 404 if the sneak peek quest is not found", async () => {
      const response = await request(app).get('/v1/sneakPeekQuests/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Sneak peek not found');
    });

    it("Should handle errors gracefully", async () => {
      jest.spyOn(SneakPeekQuests, 'findOne').mockImplementationOnce(() => {
        throw new Error("Database error");
      });

      const response = await request(app).get('/v1/sneakPeekQuests/alien');
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to fetch sneak peek");
    });
  })
});
