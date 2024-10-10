import mongoose, { Document, Schema } from 'mongoose';

export enum Role {
  Host = 'host',
  Member = 'member',
}

interface GroupMembership extends Document {
  groupId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  role: Role;
  nickname: string;
  customColor?: string;
}

const GroupMembershipSchema: Schema = new Schema<GroupMembership>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: 'UserGroup', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: Object.values(Role), default: Role.Member },
    nickname: { type: String, required: true },
    customColor: { type: String }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

export const GroupMembershipModel = mongoose.model<GroupMembership>('GroupMembership', GroupMembershipSchema);

export default GroupMembership;
export { GroupMembership };