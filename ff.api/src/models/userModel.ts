import mongoose, { Document, Schema } from 'mongoose';
import { PlayerAchievement } from './playerAchievementModel';

interface ICredential {
    credentialID: string;
    credentialPublicKey: Uint8Array;
    counter: number;
}

interface IUser extends Document {
    username: string;
    credentials: ICredential[];
    trackedPlayerAchievement?: PlayerAchievement;
}

const CredentialSchema: Schema = new Schema({
    credentialID: { type: String, required: true },
    credentialPublicKey: { type: Buffer, required: true }, // Buffer to store raw bytes
    counter: { type: Number, required: true }
});

const UserSchema: Schema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        credentials: [CredentialSchema],
        trackedPlayerAchievement: { type: Schema.Types.ObjectId, ref: 'PlayerAchievement', required: false },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
export { IUser, ICredential };
