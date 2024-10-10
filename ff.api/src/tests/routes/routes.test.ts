import request from "supertest";
import express from "express"
import crypto from 'crypto';

import router from "../../routes/routes";
import * as registrationController from "../../controllers/registrationController";
import * as authenticationController from "../../controllers/authenticationController";
import { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/typescript-types";
import authMiddleware from "../../middleware/authMiddleware";

jest.mock("../../controllers/registrationController");
jest.mock("../../controllers/authenticationController");
jest.mock("../../middleware/authMiddleware");

const app = express();
app.use(express.json());
app.use(router);

beforeEach(async () => {
  jest.clearAllMocks();
});

describe("Registration Routes", () => {
  it("should call registerGenerateOptions controller", async () => {
    jest.spyOn(registrationController, 'registerGenerateOptions').mockImplementation((req, res) => {
      return new Promise((resolve) => {
        resolve(res.status(200).send({ challenge: "testChallenge" }))
      })
    });

    const response = await request(app).post("/register/generate-options").send({
      username: "testUser",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("challenge", "testChallenge");
    expect(registrationController.registerGenerateOptions).toHaveBeenCalled();
  });

  it("should call registerVerify controller", async () => {
    jest.spyOn(registrationController, 'registerVerify').mockImplementation((req, res) => {
      return new Promise((resolve) => {
        resolve(res.status(200).send({ status: "ok", token: "testToken" }))
      })
    });

    const response = await request(app).post("/register/verify").send({
      username: "testUser",
      attestation: {
        id: "credentialID",
        rawId: "rawId",
        response: {
          attestationObject: "attestationObject",
          clientDataJSON: "clientDataJSON",
        },
        type: "public-key",
      },
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body).toHaveProperty("token", "testToken");
    expect(registrationController.registerVerify).toHaveBeenCalled();
  });
});

describe("Authentication Routes", () => {
  it("should call authenticate controller", async () => {
    const expectedResponse = {
      authOptions: "testAuthOptions",
      uuid: "6219326b-69bf-4cd4-955b-61c6be9aad61"
    };

    jest.spyOn(authenticationController, 'generateOptions').mockImplementation((req, res) => {
      res.status(200).send(expectedResponse)
      return new Promise(resolve => resolve())
    });

    const response = await request(app).get("/authenticate/generate-options");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("authOptions", "testAuthOptions");
    expect(authenticationController.generateOptions).toHaveBeenCalled();
  });

  it("should call authenticateVerify controller", async () => {
    jest.spyOn(authenticationController, 'authenticateVerify').mockImplementation((req, res) => {
      res.status(200).send({ status: "ok", token: "randomtoken" })
      return new Promise((resolve) => resolve())
    });

    const response = await request(app).post("/authenticate/verify").send({
      username: "testUser",
      credential: {
        id: "credentialID",
        rawId: "rawId",
        response: {
          authenticatorData: "authenticatorData",
          clientDataJSON: "clientDataJSON",
          signature: "signature",
          userHandle: "userHandle",
        },
      },
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body).toHaveProperty("token");
    expect(authenticationController.authenticateVerify).toHaveBeenCalled();
  });

  it("should call logoutUser controller", async () => {
    jest.spyOn(authenticationController, 'logoutUser').mockImplementation((req, res) => {
      res.status(200).send({ message: "Logged out successfully", token: "invalid" })
      return new Promise((resolve) => resolve)
    });
    jest.mocked(authMiddleware).mockImplementation((req, res, next) => next())

    const response = await request(app).post("/logout");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Logged out successfully");
    expect(authMiddleware).toHaveBeenCalled();
    expect(authenticationController.logoutUser).toHaveBeenCalled();
  });
});