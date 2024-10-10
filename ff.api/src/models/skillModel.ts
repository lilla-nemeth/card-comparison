import mongoose, { Document, Schema } from 'mongoose';

interface ISkill extends Document {
  name: string;
  challenge_rating: number;
  skill_category: string;
  difficulty_level: string;
}

const SkillSchema: Schema = new Schema({
  name: { type: String, required: true },
  challenge_rating: { type: Number, required: false },
  skill_category: { type: String, required: false },
  difficulty_level: { type: String, required: false }
},{
  toJSON: {
    virtuals: true
  }
}
);

const Skill = mongoose.model<ISkill>('Skill', SkillSchema);

export default Skill;
export { ISkill, SkillSchema };