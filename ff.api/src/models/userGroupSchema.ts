import mongoose, { Document, Schema } from 'mongoose';

interface UserGroup extends Document {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserGroupSchema: Schema = new Schema<UserGroup>(
  {
    name: { type: String, required: true },
    description: { type: String }
  },
  {
    timestamps: true,
  }
);

export const UserGroupModel = mongoose.model<UserGroup>('UserGroup', UserGroupSchema);

export default UserGroup;
export { UserGroup };
