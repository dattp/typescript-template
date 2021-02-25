import { Types } from "mongoose";
import { PubCampaignDTO } from "../dtos/pub-campaign.dto";
import PubCampaignModel, { IPubCampaign } from "../models/pub-campaign.model";
import { IPubCampaignService } from "./interfaces/i.pub-campaign.service";

class PubCampaignService implements IPubCampaignService {
  public async registerCampaign(
    pubCampaignDTO: PubCampaignDTO
  ): Promise<IPubCampaign> {
    try {
      const pubCampaign = new PubCampaignModel(pubCampaignDTO);
      return PubCampaignModel.create(pubCampaign);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getPubCampaignByPubAndCampaign(
    pub: string,
    campaign: string
  ): Promise<IPubCampaign | null> {
    try {
      return PubCampaignModel.findOne({ pub: pub, campaign: campaign }).lean();
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getListCampaignByPub(
    pubEmail: string,
    status?: number | null
  ): Promise<IPubCampaign[]> {
    try {
      if (!Number.isInteger(status) || status === null) {
        return PubCampaignModel.find({ pub_email: pubEmail })
          .sort({ _id: -1 })
          .lean();
      } else {
        return PubCampaignModel.find({ pub_email: pubEmail, status: status })
          .sort({ _id: -1 })
          .lean();
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getPubCampaignByShortLink(
    shortLink: string
  ): Promise<IPubCampaign | null> {
    try {
      return PubCampaignModel.findOne({ short_link: shortLink }).lean();
    } catch (error) {
      throw new Error(error);
    }
  }
}

export { PubCampaignService };
