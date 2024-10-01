import mongoose, { Document, Schema } from 'mongoose';

interface IMedia {
  _id: mongoose.Types.ObjectId;
  image?: string;
  video?: string;
}

const MediaSchema: Schema = new Schema({
  image: { type: String },
  video: { type: String }
},
  {
    toJSON: {
      virtuals: true
    }
  });

export { IMedia, MediaSchema };