import mongoose, { Schema } from 'mongoose';

import { IMedia, MediaSchema } from './mediaModel';
import { IResource, ResourceSchema } from './resourceModel';
import { ITool, ToolSchema } from './toolModel';
import { ISkill, SkillSchema } from './skillModel';

enum HighlightType {
  Normal = 'normal',
  Challenge = 'challenge',
}

interface ReviewStatus {
  processed: boolean;
  textVerified: boolean;
  ingredientsVerified: boolean;
  mediaGenerated: boolean;
  mediaApproved: boolean;
  skillsAssigned: boolean;
}

interface IStep extends Document {
  _id: mongoose.Types.ObjectId;
  attachable: boolean;
  downtime?: number;
  highlight?: HighlightType;
  media?: IMedia;
  rawData?: String;
  resources?: IResource[];
  reviewStatus: ReviewStatus;
  skills?: ISkill[];
  subSteps?: IStep[];
  suggestedMedias?: IMedia[];
  text: string;
  textTemplateLiteral?: string;
  tools?: ITool[];
}

const ReviewStatusSchema = new Schema({
  processed: { type: Boolean, default: false },
  textVerified: { type: Boolean, default: false },
  ingredientsVerified: { type: Boolean, default: false },
  mediaGenerated: { type: Boolean, default: false },
  mediaApproved: { type: Boolean, default: false },
  skillsAssigned: { type: Boolean, default: false },
}, { _id: false }); // _id: false prevents creation of a separate _id for this subdocument


const StepSchema: Schema = new Schema({
  attachable: { type: Boolean, required: true, default: true },
  downtime: { type: Number },
  highlight: { type: String, enum: Object.values(HighlightType) },
  media: { type: MediaSchema },
  rawData: { type: String },
  resources: { type: [ResourceSchema] },
  reviewStatus: { type: ReviewStatusSchema, required: true, default: () => ({}) },
  skills: { type: [SkillSchema], ref: 'Skill' },
  suggestedMedias: { type: [MediaSchema] },
  text: { type: String, required: true },
  textTemplateLiteral: { type: String, required: false },
  tools: { type: [ToolSchema], ref: 'Tool' }
},
  {
    toJSON: {
      virtuals: true
    }
  });
StepSchema.add({ subSteps: { type: [StepSchema] } })

const Step = mongoose.model<IStep>('Step', StepSchema)

export default Step;
export { IStep, StepSchema };
