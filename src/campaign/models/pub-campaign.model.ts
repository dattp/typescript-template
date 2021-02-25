import mongoose, { Schema, Document } from "mongoose";

import { ICampaign } from "./campaign.model";
import { IUser } from "../../user/models/user.model";

export enum StatusRegisterCampagin {
  open = 0,
  registed = 1,
  pedding = 2,
  destroy = 3,
  locked = 4,
}

export interface IPubCampaign extends Document {
  pub: IUser["_id"];
  campaign: ICampaign["_id"];
  pub_email: IUser["email"];
  campaign_id: ICampaign["camp_id"];
  register_time: Date;
  status: StatusRegisterCampagin;
  updated_time: Date;
  pub_product_link: string;
  short_link: string;
}

const PubCampaignSchema: Schema = new Schema({
  pub: { type: Schema.Types.ObjectId, ref: "User", required: true },
  campaign: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
  pub_email: { type: String, required: true },
  campaign_id: { type: String, required: true },
  register_time: { type: Date, required: true },
  status: { type: StatusRegisterCampagin, required: true },
  updated_time: { type: Date, required: true },
  pub_product_link: { type: String, required: true },
  short_link: { type: String, required: false },
});

PubCampaignSchema.index({ pub: -1, campaign: -1 }, { unique: true });

export default mongoose.model<IPubCampaign>("Pub-Campaign", PubCampaignSchema);
