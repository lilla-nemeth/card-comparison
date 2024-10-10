import mongoose, { Document, Schema } from 'mongoose';

interface ILandingPageQuestLines extends Document {
    achievements: mongoose.Types.ObjectId[];
    url: string;
}

const LandingPageQuestLinesSchema: Schema = new Schema({
    achievements: [{ type: mongoose.Types.ObjectId, ref: 'Achievement' }],
    url: { type: String, required: true }
});

const LandingPageQuestLines = mongoose.model<ILandingPageQuestLines>('LandingPageQuestLines', LandingPageQuestLinesSchema);

export default LandingPageQuestLines;
export { ILandingPageQuestLines, LandingPageQuestLinesSchema };
