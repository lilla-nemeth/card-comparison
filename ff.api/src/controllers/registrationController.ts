import { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  VerifiedRegistrationResponse,
  VerifyRegistrationResponseOpts,
} from "@simplewebauthn/server";
import {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/typescript-types";
import dotenv from "dotenv";

import { PlayerAchievementModel } from "../models/playerAchievementModel";
import { createPlayerAchievements } from '../services/playerAchievementService';
import RegistrationChallengeModel from "../models/registrationChallengeModel";
import { UserGroupModel } from "../models/userGroupSchema";
import { GroupMembershipModel, Role } from "../models/userGroupMembershipModel";

dotenv.config();

const rpName = process.env.VITE_PASSKEY_RPNAME!;
const rpID = process.env.VITE_PASSKEY_RPID!;
const origin = `https://${rpID}`;

const registerGenerateOptions = async (req: Request, res: Response) => {
  const { username }: { username: string } = req.body;

  let existingUser = await User.findOne({ username });

  let userID;
  if (existingUser) {
    userID = existingUser._id;
  } else {
    userID = new Uint8Array(crypto.randomBytes(16));
  }

  const userPasskeys = existingUser ? existingUser.credentials : [];

  // If the user does not exist, proceed with generating registration options without excluding credentials
  const registrationOptions: PublicKeyCredentialCreationOptionsJSON =
    await generateRegistrationOptions({
      rpName,
      rpID,
      userID,
      userDisplayName: username,
      userName: username,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "discouraged",
        userVerification: "preferred",
      },
      excludeCredentials: userPasskeys.map((passkey) => ({
        id: passkey.credentialID,
        transports: [],
      })),
      supportedAlgorithmIDs: [-7, -257],
    });

  await RegistrationChallengeModel.create({ registrationOptions, username })

  return res.json(registrationOptions);
};

const registerVerify = async (req: Request, res: Response) => {
  const {
    username,
    attestation,
    tpaId
  }: { username: string; attestation: RegistrationResponseJSON, tpaId: string } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const registrationChallenge = await RegistrationChallengeModel.findOne({ username })
  const registrationOptions = registrationChallenge?.registrationOptions

  if (!registrationOptions) {
    return res
      .status(400)
      .send({ error: "Registration challenge not found or expired" });
  }
  const expectedChallenge = registrationOptions.challenge;

  let verification: VerifiedRegistrationResponse;
  try {
    const opts: VerifyRegistrationResponseOpts = {
      response: attestation,
      expectedChallenge: `${expectedChallenge}`,
      expectedOrigin: origin,
      expectedRPID: rpID,
    };
    verification = await verifyRegistrationResponse(opts);
  } catch (error) {
    return res
      .status(400)
      .send({ error: "Error verifying registration response" + error });
  }

  const { verified, registrationInfo } = verification;

  if (verified && registrationInfo) {
    const { credentialPublicKey, credentialID, counter } = registrationInfo;

    const user = new User({
      username,
      credentials: [
        {
          credentialID,
          credentialPublicKey: Buffer.from(credentialPublicKey),
          counter,
        },
      ],
    });

    try {
      await user.save();
      await createPlayerAchievements(user.id)
      const userGroup = new UserGroupModel({
        name: 'Your group',
        members: [user.id]
      })
      await userGroup.save();
      user.activeUserGroup = userGroup.id

      const membership = new GroupMembershipModel({
        groupId: userGroup.id,
        role: Role.Host,
        nickname: user.username,
        userId: user
      });
      await membership.save()
      await user.save()

      // Add trackedPlayerAchievement if it was send from the frontend
      if (tpaId) {
        const trackedPlayerAchievement = await PlayerAchievementModel
          .findOne({ playerId: user!.id, achievement: tpaId })
          .populate('achievement');
        if (trackedPlayerAchievement) {
          user.trackedPlayerAchievements.push(trackedPlayerAchievement.id)
          await user.save()
        }
      }
    } catch (error) {
      return res.status(500).send({ error: "Failed to save user" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.VITE_JWT_SECRET!,
      { expiresIn: "4d" },
    );

    res.json({ status: "ok", token, user });
  } else {
    return res.status(400).send({ error: "Can't verify user" });
  }
};

const registerCreateShadowAccount = async (req: Request, res: Response) => {
  const { tpaId }: { tpaId: string } = req.body;

  const uuid = crypto.randomUUID().toString();
  const username = uuid;
  const user = new User({ username, shadowAccount: true });

  try {
    await user.save();
    await createPlayerAchievements(user.id)
    const userGroup = new UserGroupModel({
      name: 'Your group',
      members: [user.id]
    })
    await userGroup.save();
    user.activeUserGroup = userGroup.id

    const membership = new GroupMembershipModel({
      groupId: userGroup.id,
      role: Role.Host,
      nickname: user.username,
      userId: user
    });
    await membership.save()
    await user.save()

    // Add trackedPlayerAchievement if it was send from the frontend
    if (tpaId) {
      const trackedPlayerAchievement = await PlayerAchievementModel
        .findOne({ playerId: user!.id, achievement: tpaId })
        .populate('achievement');
      if (trackedPlayerAchievement) {
        user.trackedPlayerAchievements.push(trackedPlayerAchievement.id)
        await user.save()
      }
    }
  } catch (error) {
    return res.status(500).send({ error: "Failed to save user" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.VITE_JWT_SECRET!,
    { expiresIn: "4d" },
  );

  res.json({ status: "ok", token, shadowAccount: true, user });
};

const registerGenerateOptionsForShadowAccount = async (req: Request, res: Response) => {
  const { username, newUsername }: { username: string, newUsername: string } = req.body;

  let user = await User.findOne({ username, shadowAccount: true });

  let userID;
  if (!user) {
    return res.status(404).send({ error: 'Shadow account not found' })
  }

  const userPasskeys = user ? user.credentials : [];

  // If the user does not exist, proceed with generating registration options without excluding credentials
  const registrationOptions: PublicKeyCredentialCreationOptionsJSON =
    await generateRegistrationOptions({
      rpName,
      rpID,
      userID,
      userDisplayName: newUsername,
      userName: newUsername,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "discouraged",
        userVerification: "preferred",
      },
      excludeCredentials: userPasskeys.map((passkey) => ({
        id: passkey.credentialID,
        transports: [],
      })),
      supportedAlgorithmIDs: [-7, -257],
    });

  await RegistrationChallengeModel.create({ registrationOptions, username })

  return res.json(registrationOptions);
};

const registerVerifyShadowAccount = async (req: Request, res: Response) => {
  const {
    username,
    newUsername,
    attestation
  }: { username: string, newUsername: string, attestation: RegistrationResponseJSON } = req.body;

  const existingUser = await User.findOne({ username, shadowAccount: true });
  if (!existingUser) {
    return res.status(404).send("Shadow user not found")
  }

  const registrationChallenge = await RegistrationChallengeModel.findOne({ username })
  const registrationOptions = registrationChallenge?.registrationOptions

  if (!registrationOptions) {
    return res
      .status(400)
      .send({ error: "Registration challenge not found or expired" });
  }
  const expectedChallenge = registrationOptions.challenge;

  let verification: VerifiedRegistrationResponse;
  try {
    const opts: VerifyRegistrationResponseOpts = {
      response: attestation,
      expectedChallenge: `${expectedChallenge}`,
      expectedOrigin: origin,
      expectedRPID: rpID,
    };
    verification = await verifyRegistrationResponse(opts);
  } catch (error) {
    return res
      .status(400)
      .send({ error: "Error verifying registration response" + error });
  }

  const { verified, registrationInfo } = verification;

  if (verified && registrationInfo) {
    const { credentialPublicKey, credentialID, counter } = registrationInfo;

    existingUser.username = newUsername
    existingUser.shadowAccount = false
    existingUser.credentials = [
      {
        credentialID,
        credentialPublicKey: Buffer.from(credentialPublicKey),
        counter,
      },
    ]

    try {
      await existingUser.save();
    } catch (error) {
      return res.status(500).send({ error: "Failed to save user" });
    }

    const token = jwt.sign(
      { id: existingUser._id, username: existingUser.username },
      process.env.VITE_JWT_SECRET!,
      { expiresIn: "4h" },
    );
    res.json({ status: "ok", token, user: existingUser });
  } else {
    return res.status(400).send({ error: "Can't verify shadow account" });
  }
};


export {
  registerGenerateOptions,
  registerGenerateOptionsForShadowAccount,
  registerVerify,
  registerCreateShadowAccount,
  registerVerifyShadowAccount
};
