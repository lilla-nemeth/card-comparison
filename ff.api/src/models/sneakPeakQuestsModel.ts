import mongoose, { Document, Schema } from 'mongoose';

interface ISneakPeekQuest extends Document {
    quest: mongoose.Types.ObjectId
    index: number;
}

interface ISneakPeekQuestPage extends Document {
    quests: ISneakPeekQuest[];
    url: string;
}

const SneakPeekQuestSchema: Schema = new Schema({
    quest: { type: mongoose.Types.ObjectId, ref: 'Quest', required: true },
    index: { type: Number, required: true }
});

const SneakPeekQuestPageSchema: Schema = new Schema({
    quests: [SneakPeekQuestSchema],
    url: { type: String, required: true }
});

const SneakPeekQuests = mongoose.model<ISneakPeekQuestPage>('SneakPeekQuests', SneakPeekQuestPageSchema);

export default SneakPeekQuests;
export { ISneakPeekQuest, ISneakPeekQuestPage, SneakPeekQuestSchema };