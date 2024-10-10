import mongoose, { CallbackError, Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs'

export interface IAdminUser extends Document {
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminUserSchema: Schema = new Schema<IAdminUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

AdminUserSchema.pre('save', async function(this: IAdminUser, next) {
  const user = this;

  if (!user.isModified('password')) {
    next();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (err) {
    next(err as CallbackError);
  }
})

AdminUserSchema.methods.comparePassword = async function (candidatePassword: string) {
  const user = this as IAdminUser;
  return bcrypt.compare(candidatePassword, user.password);
};

const AdminUser = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

export default AdminUser;
