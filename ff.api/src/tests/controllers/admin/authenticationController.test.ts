import request from "supertest";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import app from "../../../app"
import AdminUser, { IAdminUser } from "../../../models/adminUserModel";

describe("Admin Authentication controller", () => {

  let adminUser: IAdminUser;
  beforeEach(async () => {
    adminUser = new AdminUser({ username: 'johnadmin', password: 'passpass' })
    return await adminUser.save()
  })

  describe("POST /api/admin/authenticate", () => {
    it("Should generate session token with valid password", async () => {
      const payload = {
        username: 'johnadmin',
        password: 'passpass'
      }
      const response = await request(app)
        .post('/v1/admin/authenticate')
        .send(payload)

      expect(response.status).toBe(200)
      expect(response.body['status']).toBe('ok')
      expect(response.body['token']).toBe
    })

    it("Should return 404 if the username is not found", async () => {
      const payload = {
        username: 'nonexistent',
        password: 'passpass',
      };

      const response = await request(app)
        .post('/v1/admin/authenticate')
        .send(payload)
        .expect(404)
    });

    it("Should return 401 if the password is incorrect", async () => {
      const payload = {
        username: 'johnadmin',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/v1/admin/authenticate')
        .send(payload);

      expect(response.status).toBe(404);
    });

    it("Should handle errors and return 500", async () => {
      const payload = {
        username: 'johnadmin',
        password: 'passpass',
      };

      jest.spyOn(AdminUser, 'findOne').mockImplementationOnce(() => {
        throw new Error("Database error");
      });

      const response = await request(app)
        .post('/v1/admin/authenticate')
        .send(payload);

      expect(response.status).toBe(500);
    });
  })
});
