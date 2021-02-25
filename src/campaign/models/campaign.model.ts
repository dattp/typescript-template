import mongoose, { Schema, Document } from "mongoose";

export enum CampaignTypesList {
  "CPA",
  "CPL",
  "CPS",
  "CPI",
  "D2C",
  "CPR",
  "CPDL",
  "mixed",
}

export interface ICampaign extends Document {
  camp_id: string;
  name: string;
  adv: { type: Schema.Types.ObjectId; ref: "User" };
  category: { type: Schema.Types.ObjectId; ref: "Category" };
  type: CampaignTypesList;
  description: string;
  visible: boolean;
  logo: string;
  geo: string;
  introduction: string;
  recording_conditions: string;
  cancel_reasons: string;
  commission_policy: string;
  cookie_policy: string;
  other_notices: string;
  traffic_regulation: string;
  auto_approve: boolean;
  datafeed: boolean;
  product_link: string;
}

const CampaignSchema: Schema = new Schema({
  camp_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  adv: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  type: {
    type: String,
    required: true,
    enum: Object.values(CampaignTypesList),
  },
  description: { type: String, required: true },
  visible: { type: Boolean, required: true },
  logo: { type: String, required: true },
  geo: { type: String, required: true },
  introduction: { type: String, required: true },
  recording_conditions: { type: String, required: true },
  cancel_reasons: { type: String, required: true },
  commission_policy: { type: String, required: true },
  cookie_policy: { type: String, required: true },
  other_notices: { type: String, required: true },
  traffic_regulation: { type: String, required: true },
  auto_approve: { type: Boolean, required: true },
  datafeed: { type: Boolean, required: true },
  product_link: { type: String, required: true },
});

export default mongoose.model<ICampaign>("Campaign", CampaignSchema);
