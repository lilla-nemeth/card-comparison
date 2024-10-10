import mongoose, { Document, Schema } from "mongoose";

interface IChannel extends Document {
  url: string;
  users: mongoose.Types.ObjectId[]; // References to users in the channel
  questId: string;
  userGroup: mongoose.Types.ObjectId; // References to user group in the channel
}

const ChannelSchema: Schema = new Schema<IChannel>(
  {
    url: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Reference to User documents
    userGroup: { type: Schema.Types.ObjectId, ref: 'UserGroup' }, // Reference to User documents
    questId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Channel = mongoose.model<IChannel>('Channel', ChannelSchema);

export default Channel;
export { IChannel };
