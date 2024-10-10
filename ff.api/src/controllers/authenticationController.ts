import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  GenerateAuthenticationOptionsOpts,
  VerifyAuthenticationResponseOpts,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import dotenv from "dotenv";

import User from "../models/userModel";
import ChallengeModel from "../models/challengeModel";

dotenv.config();

const rpID = process.env.VITE_PASSKEY_RPID!;
const origin = `https://${rpID}`;

const generateOptions = async (req: Request, res: Response) => {
  const opts: GenerateAuthenticationOptionsOpts = {
    timeout: 60000,
    allowCredentials: [],
    userVerification: "preferred",
    rpID,
  };

  const options = await generateAuthenticationOptions(opts);
  const uuid = crypto.randomUUID();

  await ChallengeModel.create({ uuid, challenge: options.challenge });

  res.json({ options, uuid });
};

const authenticateVerify = async (req: Request, res: Response) => {
  const { uuid }: { uuid: string } = req.body;

  const user = await User.findOne(
    { "credentials.credentialID": req.body.auth.id },
    { "credentials.$": 1 },
  );
  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  // Since we query for one ID and use projection with $ it'll return array with one element
  const credential = user.credentials[0];
  if (!credential) {
    res.status(404).send("Credentials not found");
    return;
  }

  const challengeDoc = await ChallengeModel.findOne({ uuid });
  if (!challengeDoc) {
    res.status(404).send("Expected Challenge not found");
    return;
  }

  let verification;
  try {
    const opts: VerifyAuthenticationResponseOpts = {
      response: req.body.auth,
      expectedChallenge: `${challengeDoc.challenge}`,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: credential.credentialID,
        credentialPublicKey: new Uint8Array(
          credential.credentialPublicKey.buffer,
          credential.credentialPublicKey.byteOffset,
          credential.credentialPublicKey.byteLength,
        ),
        counter: credential.counter,
      },
      requireUserVerification: false,
    };
    verification = await verifyAuthenticationResponse(opts);
  } catch (error) {
    res.status(400).send("Authentication failed");
    return;
  }

  const newCounter = verification.authenticationInfo.newCounter;
  await User.updateOne(
    { _id: user._id, "credentials.credentialID": credential.credentialID },
    { $set: { "credentials.$.counter": newCounter } },
  );

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.VITE_JWT_SECRET!,
    { expiresIn: "4d" },
  );

  res.json({ status: "ok", token, user });
};

const logoutUser = (req: Request, res: Response) => {
  try {
    // Check if the user property is set by the auth middleware, indicating a valid JWT
    if (!req.user) {
      res
        .status(401)
        .send({ message: "Logout failed: No valid token provided" });
      return;
    }
    res.status(200).send({
      message: "Logged out successfully",
      token: "invalid",
      expires: 0,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Logout Error:", error.message, error.stack);
    } else {
      console.error("Logout Error: An unknown error occurred.");
    }
    res.status(500).send({
      message: "Failed to logout",
      error: "An error occurred during logout",
    });
  }
};

export { authenticateVerify, generateOptions, logoutUser };
