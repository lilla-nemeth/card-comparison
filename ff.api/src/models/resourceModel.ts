import mongoose, { Schema } from 'mongoose';

interface IResource {
  name: string;
  quantity: string;
  unit: string;
}

const ResourceSchema: Schema = new Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: false, default: "" },
  unit: { type: String, required: false, default: "" }
});

const Resource = mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;
export { IResource, ResourceSchema };
