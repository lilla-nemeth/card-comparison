import mongoose, { Document, Schema } from 'mongoose';

export enum UserColors {
  red = "#FF0000",
  green = "#00FF00",
  blue = "#0000FF",
  yellow = "#FFFF00",
  cyan = "#00FFFF",
  magenta = "#FF00FF",
  orange = "#FFA500",
  purple = "#800080",
  lime = "#00FF00",
  pink = "#FFC0CB",
  teal = "#008080",
  brown = "#A52A2A",
  lavender = "#E6E6FA",
  maroon = "#800000",
  olive = "#808000",
  navy = "#000080",
  grey = "#808080",
  coral = "#FF7F50",
  turquoise = "#40E0D0",
  gold = "#FFD700"
};

type UserColorsType = keyof typeof UserColors;

export function randomPlayerColor() {
  const colorNames = Object.keys(UserColors) as UserColorsType[];
  const randomIndex = Math.floor(Math.random() * colorNames.length);
  const randomColorName = colorNames[randomIndex];
  return UserColors[randomColorName];
}

export enum ChannelUserRole {
  Host = 'host',
  Member = 'member',
}

export interface IUserChannel {
  channelId: mongoose.Types.ObjectId;
  role: ChannelUserRole;
  color: UserColors;
}

const UserChannelSchema: Schema = new Schema({
  channelId: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
  role: { type: String, enum: Object.values(ChannelUserRole), required: true },
  color: { type: String, enum: Object.values(UserColors), required: true },
});

interface ICredential {
  credentialID: string;
  credentialPublicKey: Uint8Array;
  counter: number;
}

interface IUser extends Document {
  activeUserGroup: mongoose.Types.ObjectId;
  username: string;
  credentials: ICredential[];
  shadowAccount: boolean;
  trackedPlayerAchievements: mongoose.Types.ObjectId[];
  channels: IUserChannel[];
}

const CredentialSchema: Schema = new Schema({
  credentialID: { type: String, required: true },
  credentialPublicKey: { type: Buffer, required: true }, // Buffer to store raw bytes
  counter: { type: Number, required: true }
});

const UserSchema: Schema = new Schema<IUser>(
  {
    activeUserGroup: { type: Schema.Types.ObjectId, ref: 'UserGroup' },
    username: { type: String, required: true, unique: true },
    credentials: [CredentialSchema],
    shadowAccount: { type: Boolean, required: true, default: false },
    trackedPlayerAchievements: [{ type: Schema.Types.ObjectId, ref: 'PlayerAchievement', default: [] }],
    channels: [UserChannelSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
export { IUser, ICredential };

