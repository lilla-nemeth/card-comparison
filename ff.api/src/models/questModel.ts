import mongoose, { Document, Schema } from 'mongoose';
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { IMedia, MediaSchema } from './mediaModel';

export enum QuestState {
  Draft = 'Draft',
  Published = 'published',
}

interface IQuest extends Document {
  creator: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  media?: IMedia;
  name: string;
  state: QuestState;
  recipe: mongoose.Types.ObjectId;
}

const QuestSchema: Schema = new Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, index: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: 'QuestTag', index: true }],
  media: { type: MediaSchema },
  name: { type: String, required: true },
  state: { type: String, enum: Object.values(QuestState), default: QuestState.Draft },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true, index: true }
},
  {
    toJSON: {
      virtuals: true
    }
  });

QuestSchema.plugin(mongooseLeanVirtuals);

const Quest = mongoose.model<IQuest>('Quest', QuestSchema);

export default Quest;
export { IQuest, QuestSchema };
