import mongoose, { Schema } from 'mongoose';

interface IQuestTag extends Document {
    title: string;
}

// Define the Quest schema
const QuestTagSchema: Schema = new Schema({
    title: { type: String, required: true }
});

const QuestTag = mongoose.model<IQuestTag>('QuestTag', QuestTagSchema, 'QuestTags');

export default QuestTag;
export { IQuestTag };
