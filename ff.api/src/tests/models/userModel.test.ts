import mongoose from "mongoose";
import UserModel, { ICredential } from "../../models/userModel";

describe("UserModel", () => {

  beforeEach(async () => {
    await UserModel.deleteMany({}).catch((error) => {
      console.error(
        "Failed to delete many UserModel documents:",
        error.message,
        error.stack
      );
    });
  });

  it("should create and save a user successfully", async () => {
    const userData = { username: "testUser" };
    const validUser = new UserModel(userData);

    const savedUser = await validUser.save().catch((error) => {
      console.error(
        "Failed to save UserModel document:",
        error.message,
        error.stack
      );
    });

    if (!savedUser) {
      throw new Error("User not saved");
    }

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.credentials).toEqual([]);
  });

  it("should fail to save a user without required fields", async () => {
    const invalidUser = new UserModel();
    let error;

    try {
      await invalidUser.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    if (error instanceof mongoose.Error.ValidationError) {
      expect(error.errors.username).toBeDefined();
    }
  });

  it("should add a credential to a user successfully", async () => {
    const userData = { username: "testUser" };
    const user = new UserModel(userData);
    await user.save();

    const credentialData = {
      credentialID: "credential123",
      credentialPublicKey: Buffer.from("publicKey"),
      counter: 1,
    };

    user.credentials.push(credentialData);
    const updatedUser = await user.save();

    expect(updatedUser.credentials.length).toBe(1);
    expect(updatedUser.credentials[0].credentialID).toBe(credentialData.credentialID);
    expect(updatedUser.credentials[0].credentialPublicKey.toString()).toBe(credentialData.credentialPublicKey.toString());
    expect(updatedUser.credentials[0].counter).toBe(credentialData.counter);
  });

  it("should fail to add a credential without required fields", async () => {
    const userData = { username: "testUser" };
    const user = new UserModel(userData);
    await user.save();

    const invalidCredentialData = { credentialID: "credential123" } as unknown as ICredential;
    user.credentials.push(invalidCredentialData);

    let error;

    try {
      await user.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    if (error instanceof mongoose.Error.ValidationError) {
      expect(error.errors["credentials.0.credentialPublicKey"]).toBeDefined();
      expect(error.errors["credentials.0.counter"]).toBeDefined();
    }
  });

  it("should query user by credential ID", async () => {
    const userData = { username: "testUser" };
    const credentialData = {
      credentialID: "credential123",
      credentialPublicKey: Buffer.from("publicKey"),
      counter: 1,
    };

    const user = new UserModel(userData);
    user.credentials.push(credentialData);
    await user.save();

    const foundUser = await UserModel.findOne({ "credentials.credentialID": "credential123" });

    expect(foundUser).not.toBeNull();
    if (foundUser) {
      expect(foundUser.username).toBe(userData.username);
    }
  });
});
