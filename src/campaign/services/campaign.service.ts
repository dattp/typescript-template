import { Types } from "mongoose";

import { ICampaignService } from "./interfaces/i.campaign.service";
import CampaignModel, { ICampaign } from "../models/campaign.model";

class CampaignService implements ICampaignService {
  public async getListCampaign(ids?: string[]): Promise<ICampaign[]> {
    try {
      if (ids) {
        return CampaignModel.find({ _id: { $in: ids } })
          .sort({ _id: -1 })
          .lean();
      }
      return CampaignModel.find({}).sort({ _id: -1 }).lean();
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getCampaign(id: string): Promise<ICampaign | null> {
    try {
      return CampaignModel.findById(id).lean();
    } catch (error) {
      throw new Error(error);
    }
  }
}

export { CampaignService };
