import mongoose, { Document, Schema } from 'mongoose';

interface ChallengeDocument extends Document {
    uuid: string;
    challenge: string;
}

const ChallengeSchema: Schema = new Schema({
    uuid: { type: String, required: true, unique: true },
    challenge: { type: String, required: true }
});

const ChallengeModel = mongoose.model<ChallengeDocument>('Challenge', ChallengeSchema);

export default ChallengeModel;
