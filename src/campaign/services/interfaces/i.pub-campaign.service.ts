import { PubCampaignDTO } from "../../dtos/pub-campaign.dto";
import { IPubCampaign } from "../../models/pub-campaign.model";

interface IPubCampaignService {
  registerCampaign(pubCampaignDTO: PubCampaignDTO): Promise<IPubCampaign>;
  getListCampaignByPub(
    pubEmail: string,
    status?: number | null
  ): Promise<IPubCampaign[]>;
  getPubCampaignByPubAndCampaign(
    pub: string,
    campaign: string
  ): Promise<IPubCampaign | null>;
  getPubCampaignByShortLink(shortLink: string): Promise<IPubCampaign | null>;
}

export { IPubCampaignService };
