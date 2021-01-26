import mongoose, { Schema, Document } from "mongoose";

export interface IUrl extends Document {
  _id: string;
  short_url: string;
  full_url: string;
  click: string;
  status: number;
}

const UrlSchema: Schema = new Schema({
  short_url: { type: String, required: true },
  full_url: { type: String, required: true },
  click: { type: Number },
  status: { type: Number, required: true, default: 2 },
});

export default mongoose.model<IUrl>("Url", UrlSchema);
