import request from "supertest";
import app from "../../app"

import Quest from "../../models/questModel";

import { createTestData } from "../helpers/testData";

describe("Quests controller", () => {
  let token: string;

  beforeEach(async () => {
    const data = await createTestData()
    token = data.token
  })

  describe("GET /api/quests", () => {
    it("Should return all quests", async () => {
      const response = await request(app)
        .get('/v1/quests')
        .set('Authorization', `Bearer ${token}`)
      const quests = await Quest.find()

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(quests.length)
    })
  })
});
