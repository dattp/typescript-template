import { Types } from "mongoose";

import { ICampaign } from "../../models/campaign.model";

interface ICampaignService {
  getListCampaign(ids?: string[]): Promise<ICampaign[]>;
  getCampaign(id: string): Promise<ICampaign | null>;
}

export { ICampaignService };
