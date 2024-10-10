import mongoose, { Document, Schema } from 'mongoose';

interface ITool {
  icon: string;
  name: string;
}

const ToolSchema: Schema = new Schema({
  icon: { type: String, required: false, default: "" },
  name: { type: String, required: true }
});

export { ITool, ToolSchema };
