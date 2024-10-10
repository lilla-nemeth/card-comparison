import mongoose, { Document, Schema } from 'mongoose';
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { IMedia, MediaSchema } from './mediaModel';
import { IResource, ResourceSchema } from './resourceModel';
import { IStep, StepSchema } from './stepModel';

export enum RecipeState {
  Draft = 'Draft',
  Published = 'published',
}

export enum RecipeProcessingState {
  NeedProcessing = 'NeedProcessing',
  DoNotProcess = 'DoNotProcess',
  Processing = 'Processing',
  Processed = 'Processed'
}

interface IRecipe extends Document {
  _id: mongoose.Types.ObjectId;
  resources?: IResource[];
  hash?: string;
  name?: string;
  media?: IMedia;
  processingState: RecipeProcessingState;
  rawData?: String;
  simplifiedData?: String;
  state: RecipeState;
  steps: IStep[];
  description?: string;
  creator: mongoose.Types.ObjectId;
}

const RecipeSchema: Schema = new Schema({
  hash: { type: String, required: false },
  resources: { type: [ResourceSchema] },
  name: { type: String, required: false },
  media: { type: MediaSchema },
  processingState: { type: String, enum: Object.values(RecipeProcessingState), default: RecipeProcessingState.DoNotProcess },
  rawData: { type: String },
  simplifiedData: { type: String },
  state: { type: String, enum: Object.values(RecipeState), default: RecipeState.Draft },
  steps: { type: [StepSchema], default: [] },
  description: { type: String, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: false, index: true },
},
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);
RecipeSchema.plugin(mongooseLeanVirtuals);

const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);

export default Recipe;
export { IRecipe, RecipeSchema };
