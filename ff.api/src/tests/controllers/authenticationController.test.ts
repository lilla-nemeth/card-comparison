import request from "supertest";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import crypto, { UUID } from "crypto"
import { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/typescript-types";
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  VerifiedAuthenticationResponse
} from "@simplewebauthn/server";

import app from "../../app"
import UserModel from "../../models/userModel";
import ChallengeModel from "../../models/challengeModel";

const staticUUID: UUID = "6219326b-69bf-4cd4-955b-61c6be9aad61"
const staticJWTTOken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

const opts: PublicKeyCredentialRequestOptionsJSON = {
  challenge: 'c29tZV9yYW5kb21fY2hhbGxlbmdl',
  timeout: 60000,
  rpId: 'example.com',
  allowCredentials: [],
  userVerification: 'preferred',
  extensions: {}
}

const verificationResponse: VerifiedAuthenticationResponse = {
  verified: true,
  authenticationInfo: {
    credentialID: 'credential-id',
    newCounter: 1,
    userVerified: true,
    credentialDeviceType: 'singleDevice',
    credentialBackedUp: false,
    origin: 'localhost',
    rpID: 'fixfood-test'
  },
};

const testUserParams = {
  username: 'testuser',
  credentials: [{
    credentialID: Buffer.from('credential-id'),
    credentialPublicKey: Buffer.from('credential-public-key'),
    counter: 0,
  }]
}

const challengeParams = {
  uuid: staticUUID,
  challenge: opts.challenge
}

jest.mock('@simplewebauthn/server')

describe("Authentication controller", () => {

  describe("GET /api/authenticate", () => {
    it("Should generate authentication options", async () => {
      jest.mocked(generateAuthenticationOptions).mockResolvedValue(opts)
      jest.spyOn(crypto, 'randomUUID').mockReturnValue(staticUUID)

      const response = await request(app).get('/v1/authenticate/generate-options')

      const expectedResponse = {
        options: opts,
        uuid: staticUUID
      }

      expect(response.status).toBe(200)
      expect(response.body).toEqual(expectedResponse)
    })
  })

  describe("POST /api/authenticate/verify", () => {
    it("Should generate session token for valid passkey", async () => {
      jest.spyOn(crypto, 'randomUUID').mockReturnValue(staticUUID)
      jest.spyOn(jwt, 'sign').mockImplementation(() => staticJWTTOken)
      jest.mocked(verifyAuthenticationResponse).mockResolvedValue(verificationResponse);

      const challenge = new ChallengeModel(challengeParams)
      await challenge.save()

      const user = new UserModel(testUserParams);
      await user.save()

      const payload = {
        uuid: staticUUID,
        auth: {
          id: 'credential-id'
        }
      }
      const response = await request(app).post('/v1/authenticate/verify').send(payload)

      const expectedResponse = {
        status: 'ok',
        token: staticJWTTOken
      }

      expect(response.status).toBe(200)
      expect(response.body).toEqual(expectedResponse)

      const updatedUser = await UserModel.findOne({ username: 'testuser' })
      expect(updatedUser!.credentials[0].counter).toBe(1);
    })

    it("Should return error if user not found", async () => {
      const user = new UserModel(testUserParams);
      await user.save()

      const payload = {
        uuid: staticUUID,
        auth: {
          id: 'non-existing-credential-id'
        }
      }
      const response = await request(app).post('/v1/authenticate/verify').send(payload)

      expect(response.status).toBe(404)
    })
  })

  it("Should return error if credentials not found", async () => {
    const challenge = new ChallengeModel(challengeParams)
    await challenge.save()

    const user = new UserModel({ ...testUserParams, credentials: [] });
    await user.save()

    const payload = {
      uuid: staticUUID,
      auth: {
        id: 'credential-id'
      }
    }
    const response = await request(app).post('/v1/authenticate/verify').send(payload)

    expect(response.status).toBe(404)
  })

  it("Should return error if challenge not found", async () => {
    const user = new UserModel(testUserParams);
    await user.save()

    const payload = {
      uuid: staticUUID,
      auth: {
        id: 'credential-id'
      }
    }
    const response = await request(app).post('/v1/authenticate/verify').send(payload)

    expect(response.status).toBe(404)
  })
});
