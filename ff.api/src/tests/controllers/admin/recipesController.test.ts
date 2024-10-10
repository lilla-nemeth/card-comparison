import request from "supertest";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

import app from "../../../app";
import AdminUser, { IAdminUser } from "../../../models/adminUserModel";
import Recipe, { RecipeState } from "../../../models/recipeModel";

describe("Recipe Controller", () => {
  let adminUser: IAdminUser;
  let token: string;
  let recipeId: string;

  beforeEach(async () => {
    // Create an admin user and generate a token
    adminUser = new AdminUser({ username: 'johnadmin', password: 'passpass' });
    await adminUser.save();
    token = jwt.sign(
      { id: adminUser._id, username: adminUser.username },
      process.env.VITE_JWT_SECRET!,
      { expiresIn: '4h' }
    );
  });

  afterEach(async () => {
    // Cleanup after tests
    await AdminUser.deleteMany({});
    await Recipe.deleteMany({});
  });

  describe("GET /api/v1/admin/recipes", () => {
    beforeEach(async () => {
      // Create multiple recipes for testing
      await Recipe.create([
        {
          name: 'Chocolate Cake',
          description: 'Delicious chocolate cake',
          creator: adminUser._id,
          state: RecipeState.Draft,
          steps: [
            { id: new Types.ObjectId().toString(), text: 'Step 1' }
          ]
        },
        { name: 'Vanilla Ice Cream', description: 'Creamy vanilla ice cream', creator: adminUser._id, state: RecipeState.Draft, steps: [] },
        { name: 'Strawberry Pie', description: 'Sweet strawberry pie', creator: adminUser._id, state: RecipeState.Draft, steps: [] }
      ]);
    });

    it("Should return all recipes when no search query is provided", async () => {
      const response = await request(app)
        .get('/v1/admin/recipes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3); // Expect all recipes to be returned
    });

    it("Should return recipes matching the search query", async () => {
      const response = await request(app)
        .get('/v1/admin/recipes?query=Chocolate')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1); // Only one recipe should match
      expect(response.body[0]).toHaveProperty('name', 'Chocolate Cake');
    });

    it("Should return an empty array if no recipes match the search query", async () => {
      const response = await request(app)
        .get('/v1/admin/recipes?query=Nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0); // No recipes should match
    });

    it("Should handle missing query parameters gracefully", async () => {
      const response = await request(app)
        .get('/v1/admin/recipes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3); // Expect all recipes to be returned
    });

    it("Should return 401 if unauthorized", async () => {
      const response = await request(app)
        .get('/v1/admin/recipes?query=Chocolate');

      expect(response.status).toBe(401); // Unauthorized
    });
  });

  describe("POST /api/v1/admin/recipes", () => {
    it("Should create a recipe with valid data", async () => {
      const payload = {
        data: {
          name: 'Recipe',
          description: 'Very nice recipe indeed',
          steps: [
            {
              rawData: "Heat up the oven to 200 celsius and skin four big potatoes.",
              text: "Heat up the oven to 200 celsius and skin potatoes.",
              subSteps: [
                { text: "Heat up the oven" },
                { text: "Skin potatoes" }
              ]
            }
          ]
        }
      };

      const response = await request(app)
        .post('/v1/admin/recipes')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Recipe');
      recipeId = response.body._id;
    });

    it("Should return 400 if required fields are missing", async () => {
      const payload = { data: { description: 'Missing name and steps' } };

      const response = await request(app)
        .post('/v1/admin/recipes')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

      expect(response.status).toBe(400); // Bad request due to missing required fields
    });

    it("Should return 401 if unauthorized", async () => {
      const payload = {
        data: {
          name: 'Unauthorized Recipe',
          description: 'Should not be created without a token',
          steps: []
        }
      };

      const response = await request(app)
        .post('/v1/admin/recipes')
        .send(payload);

      expect(response.status).toBe(401); // Unauthorized
    });
  });

  describe("PUT /api/v1/admin/recipes/:id", () => {
    beforeEach(async () => {
      // Create a recipe to be updated
      const recipe = new Recipe({
        name: 'Original Recipe',
        description: 'Original description',
        creator: adminUser._id,
        state: RecipeState.Draft,
        steps: []
      });
      await recipe.save();
      recipeId = recipe._id.toString(); // Store recipe ID
    });

    it("Should update a recipe with valid data", async () => {
      const payload = { data: { name: 'Updated Recipe', description: 'Updated description' } };

      const response = await request(app)
        .patch(`/v1/admin/recipes/${recipeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Recipe');
      expect(response.body).toHaveProperty('description', 'Updated description');
    });

    it("Should return 404 if recipe not found", async () => {
      const payload = { data: { name: 'Updated Recipe' } };

      const response = await request(app)
        .patch(`/v1/admin/recipes/${new Types.ObjectId().toString()}`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

      expect(response.status).toBe(404);
    });

    it("Should return 400 if invalid data is provided", async () => {
      const payload = { data: { name: '' } };

      const response = await request(app)
        .patch(`/v1/admin/recipes/${recipeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

      expect(response.status).toBe(400); // Bad request due to invalid data
    });
  });

  describe("GET /api/v1/admin/recipes/:id", () => {
    it("Should return a recipe by ID", async () => {
      const recipe = new Recipe({
        name: 'Test Recipe',
        description: 'Test description',
        creator: adminUser._id,
        state: RecipeState.Draft,
        steps: []
      });
      await recipe.save();
      const recipeId = recipe._id.toString();

      const response = await request(app)
        .get(`/v1/admin/recipes/${recipeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Test Recipe');
    });

    it("Should return 404 if recipe not found", async () => {
      const response = await request(app)
        .get(`/v1/admin/recipes/${new Types.ObjectId().toString()}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/v1/admin/recipes/publish/:id", () => {
    beforeEach(async () => {
      const recipe = new Recipe({
        name: 'Recipe to Publish',
        description: 'Description',
        creator: adminUser._id,
        state: RecipeState.Draft,
        steps: []
      });
      await recipe.save();
      recipeId = recipe._id.toString();
    });

    it("Should publish a recipe", async () => {
      const response = await request(app)
        .patch(`/v1/admin/recipes/${recipeId}/publish`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('state', RecipeState.Published);
    });

    it("Should return 404 if recipe not found", async () => {
      const response = await request(app)
        .patch(`/v1/admin/recipes/${new Types.ObjectId().toString()}/publish`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
