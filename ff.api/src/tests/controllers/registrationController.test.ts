import request from "supertest";
import { jest } from "@jest/globals";
import crypto from "crypto"
import User from "../../models/userModel";
import * as simpleWebAuthN from "@simplewebauthn/server";
import * as playerService from '../../services/playerAchievementService'; // Adjust the path to your playerService file

import app from "../../app"
import { PlayerAchievementModel } from "../../models/playerAchievementModel";
import { createAnyAchievements } from "../helpers/testData";
import { UserGroupModel } from "../../models/userGroupSchema";

const verificationRegistrationResponse: simpleWebAuthN.VerifiedRegistrationResponse = {
  verified: true,
  registrationInfo: {
    counter: 0,
    fmt: 'apple',
    aaguid: crypto.randomUUID.toString(),
    credentialPublicKey: new Uint8Array(crypto.randomBytes(16)),
    credentialType: 'public-key',
    credentialID: 'randomcredentialid',
    attestationObject: new Uint8Array(crypto.randomBytes(16)),
    userVerified: true,
    credentialDeviceType: 'singleDevice',
    credentialBackedUp: false,
    origin: 'origin'
  }
};

describe("Registration controller", () => {

  describe("POST /register/generate-options", () => {
    afterEach(async () => {
      jest.clearAllMocks()
    })

    it("should generate registration options", async () => {
      const response = await request(app).post("/v1/register/generate-options").send({
        username: "testUser",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("challenge");
      expect(response.body).toHaveProperty("rp");
      expect(response.body).toHaveProperty("user");
    })
  })

  describe("POST /register/verify", () => {
    it("should verify registration and apply correct trackedPlayerAchievement", async () => {

      const anotherUserGroup = new UserGroupModel({
        name: "Random User Group"
      })
      await anotherUserGroup.save();
      const achievement = await createAnyAchievements()
      jest.spyOn(simpleWebAuthN, 'verifyRegistrationResponse').mockResolvedValue(verificationRegistrationResponse)
      const createPlayerAchievementsSpy = jest.spyOn(playerService, 'createPlayerAchievements');

      const username = "testUser";
      // Step 1: Generate registration options
      const optionsResponse = await request(app).post("/v1//register/generate-options").send({
        username
      });

      expect(optionsResponse.status).toBe(200);
      const registrationOptions = optionsResponse.body;

      const registrationResponse = {
        id: "credentialID",
        rawId: Buffer.from("credentialID").toString('base64'),
        response: {
          attestationObject: Buffer.from("attestationObject").toString('base64'),
          clientDataJSON: Buffer.from(JSON.stringify({ challenge: registrationOptions.challenge })).toString('base64'),
        },
        type: "public-key",
      };

      const verifyResponse = await request(app).post("/v1//register/verify").send({
        username,
        attestation: registrationResponse,
        tpaId: achievement.id.toString()
      });

      expect(verifyResponse.status).toBe(200);
      expect(verifyResponse.body).toHaveProperty("status", "ok");
      expect(verifyResponse.body).toHaveProperty("token");

      const user = await User.findOne({ username })
      expect(createPlayerAchievementsSpy).toHaveBeenCalledWith(user!.id);
      const trackedPlayerAchievement = await PlayerAchievementModel
        .findOne({ playerId: user!.id, achievement: achievement.id })
        .populate('achievement');
      expect(user!.trackedPlayerAchievements![0]._id.toString()).toEqual(trackedPlayerAchievement!.id.toString())
      const userGroup = await UserGroupModel.findOne({ members: user })
      expect(user!.activeUserGroup._id).toEqual(userGroup!._id);
    });

    it("should return error if username already exists", async () => {
      jest.spyOn(simpleWebAuthN, 'verifyRegistrationResponse').mockResolvedValue(verificationRegistrationResponse)

      const username = "testUser";

      // Step 1: Generate registration options
      await request(app).post("/v1/register/generate-options").send({ username });

      // Simulate registration response (this would normally come from the client)
      const registrationResponse = {
        id: "credentialID",
        rawId: Buffer.from("credentialID").toString('base64'),
        response: {
          attestationObject: Buffer.from("attestationObject").toString('base64'),
          clientDataJSON: Buffer.from(JSON.stringify({ challenge: "challenge" })).toString('base64'),
        },
        type: "public-key",
      };

      // Step 2: Verify registration
      await request(app).post("/v1/register/verify").send({
        username,
        attestation: registrationResponse,
      });

      // Step 3: Try to register the same username again
      const response = await request(app).post("/v1/register/verify").send({
        username,
        attestation: registrationResponse,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Username already exists");
    });

    it("should return error if registration challenge is not found or expired", async () => {
      const username = "testUserWithoutChallenge";

      // Simulate registration response without generating options
      const registrationResponse = {
        id: "credentialID",
        rawId: Buffer.from("credentialID").toString('base64'),
        response: {
          attestationObject: Buffer.from("attestationObject").toString('base64'),
          clientDataJSON: Buffer.from(JSON.stringify({ challenge: "challenge" })).toString('base64'),
        },
        type: "public-key",
      };

      const response = await request(app).post("/v1//register/verify").send({
        username,
        attestation: registrationResponse,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Registration challenge not found or expired");
    });

    it("should return error if verification fails", async () => {
      jest.spyOn(simpleWebAuthN, 'verifyRegistrationResponse').mockResolvedValue({ verified: false })

      const username = "testUser";

      // Step 1: Generate registration options
      const optionsResponse = await request(app).post("/v1//register/generate-options").send({
        username,
      });

      expect(optionsResponse.status).toBe(200);
      const registrationOptions = optionsResponse.body;

      // Simulate invalid registration response
      const invalidRegistrationResponse = {
        id: "credentialID",
        rawId: Buffer.from("credentialID").toString('base64'),
        response: {
          attestationObject: Buffer.from("invalidAttestationObject").toString('base64'),
          clientDataJSON: Buffer.from(JSON.stringify({ challenge: registrationOptions.challenge })).toString('base64'),
        },
        type: "public-key",
      };

      // Step 2: Verify registration
      const response = await request(app).post("/v1//register/verify").send({
        username,
        attestation: invalidRegistrationResponse,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Can't verify user");
    });
  })

  describe("POST /v1/register/create-shadow-account", () => {
    it("should create a shadow account and return a token", async () => {
      const achievement = await createAnyAchievements()
      const response = await request(app).post("/v1/register/create-shadow-account").send({
        tpaId: achievement.id.toString(),
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "ok");
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("shadowAccount", true);

      const user = await User.findOne({ username: response.body.username })
      expect(user).toBeTruthy();
      expect(user!.shadowAccount).toBe(true);
    });

    it("should handle errors gracefully", async () => {
      jest.spyOn(User.prototype, 'save').mockImplementationOnce(() => {
        throw new Error("Failed to save user");
      });

      const response = await request(app).post("/v1/register/create-shadow-account").send({
        tpaId: "testTpaId",
      });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error", "Failed to save user");
    });
  });

  describe("POST /v1/register/verify-shadow-account", () => {
    it("should verify shadow account and return a token", async () => {
      jest.spyOn(simpleWebAuthN, 'verifyRegistrationResponse').mockResolvedValue(verificationRegistrationResponse);

      const shadowUsername = "generaterandomusername";
      const newUsername = "newTestUser";

      const user = new User({
        username: shadowUsername,
        shadowAccount: true,
        credentials: []
      });
      await user.save();

      // Step 1: Generate registration options
      const optionsResponse = await request(app).post("/v1/register/generate-options").send({
        username: shadowUsername
      });

      expect(optionsResponse.status).toBe(200);
      const registrationOptions = optionsResponse.body;

      const registrationResponse = {
        id: "credentialID",
        rawId: Buffer.from("credentialID").toString('base64'),
        response: {
          attestationObject: Buffer.from("attestationObject").toString('base64'),
          clientDataJSON: Buffer.from(JSON.stringify({ challenge: registrationOptions.challenge })).toString('base64'),
        },
        type: "public-key",
      };

      const verifyResponse = await request(app).post("/v1/register/verify-shadow-account").send({
        username: shadowUsername,
        newUsername,
        attestation: registrationResponse
      });

      expect(verifyResponse.status).toBe(200);
      expect(verifyResponse.body).toHaveProperty("status", "ok");
      expect(verifyResponse.body).toHaveProperty("token");

      const updatedUser = await User.findOne({ username: newUsername });
      expect(updatedUser).toBeTruthy();
      expect(updatedUser!.username).toBe(newUsername);
      expect(updatedUser!.shadowAccount).toBe(false);
    });

    it("should return 404 if shadow user is not found", async () => {
      const response = await request(app).post("/v1/register/verify-shadow-account").send({
        username: "nonexistentShadowUser",
        newUsername: "newTestUser",
        attestation: {}
      });

      expect(response.status).toBe(404);
      expect(response.text).toBe("Shadow user not found");
    });

    it("should return error if registration challenge is not found or expired", async () => {
      const shadowUsername = "generaterandomusername";
      const newUsername = "newTestUser";

      const user = new User({
        username: shadowUsername,
        shadowAccount: true,
        credentials: []
      });
      await user.save();

      const response = await request(app).post("/v1/register/verify-shadow-account").send({
        username: shadowUsername,
        newUsername,
        attestation: {}
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Registration challenge not found or expired");
    });

    it("should return error if verification fails", async () => {
      jest.spyOn(simpleWebAuthN, 'verifyRegistrationResponse').mockResolvedValue({ verified: false });

      const shadowUsername = "generaterandomusername";
      const newUsername = "newTestUser";

      const user = new User({
        username: shadowUsername,
        shadowAccount: true,
        credentials: []
      });
      await user.save();

      // Step 1: Generate registration options
      const optionsResponse = await request(app).post("/v1/register/generate-options").send({
        username: shadowUsername
      });

      expect(optionsResponse.status).toBe(200);
      const registrationOptions = optionsResponse.body;

      // Simulate invalid registration response
      const invalidRegistrationResponse = {
        id: "credentialID",
        rawId: Buffer.from("credentialID").toString('base64'),
        response: {
          attestationObject: Buffer.from("invalidAttestationObject").toString('base64'),
          clientDataJSON: Buffer.from(JSON.stringify({ challenge: registrationOptions.challenge })).toString('base64'),
        },
        type: "public-key",
      };

      const response = await request(app).post("/v1/register/verify-shadow-account").send({
        username: shadowUsername,
        newUsername,
        attestation: invalidRegistrationResponse,
        tpaId: "testTpaId",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Can't verify shadow account");
    });
  });
})