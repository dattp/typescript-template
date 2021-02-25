import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

import { CampaignTypesList, ICampaign } from "../models/campaign.model";

import { StatusRegisterCampagin } from "../models/pub-campaign.model";

interface ListCampaignDTO {
  id: string;
  name: string;
  logo: string;
}

class CampaignDTO {
  @IsString()
  @IsNotEmpty()
  private id: string;

  @IsString()
  @IsNotEmpty()
  private name: string;

  @IsString()
  @IsNotEmpty()
  private category: string;

  private type: CampaignTypesList;

  @IsString()
  private description: string;

  @IsString()
  @IsNotEmpty()
  private logo: string;

  @IsString()
  @IsNotEmpty()
  private geo: string;

  @IsString()
  @IsNotEmpty()
  private introduction: string;

  @IsString()
  @IsNotEmpty()
  private recording_conditions: string;

  @IsString()
  @IsNotEmpty()
  private cancel_reasons: string;

  @IsString()
  @IsNotEmpty()
  private commission_policy: string;

  @IsString()
  @IsNotEmpty()
  private cookie_policy: string;

  @IsString()
  @IsNotEmpty()
  private other_notices: string;

  @IsString()
  @IsNotEmpty()
  private traffic_regulation: string;

  @IsBoolean()
  @IsOptional()
  private auto_approve: boolean;

  @IsBoolean()
  @IsOptional()
  private datafeed: boolean;

  @IsString()
  private product_link: string;

  @IsNumber()
  private status: StatusRegisterCampagin;

  @IsString()
  private pub_product_link: string;

  @IsString()
  private short_link: string;

  constructor() {
    this.id = "";
    this.name = "";
    this.category = "";
    this.type = CampaignTypesList.mixed;
    this.description = "";
    this.logo = "";
    this.geo = "";
    this.introduction = "";
    this.recording_conditions = "";
    this.cancel_reasons = "";
    this.commission_policy = "";
    this.cookie_policy = "";
    this.other_notices = "";
    this.traffic_regulation = "";
    this.auto_approve = false;
    this.datafeed = false;
    this.product_link = "";
    this.status = StatusRegisterCampagin.open;
    this.pub_product_link = "";
    this.short_link = "";
  }

  public toCampaign(
    campaign: ICampaign,
    status?: StatusRegisterCampagin,
    pubProductLink?: string,
    shortLink?: string
  ): CampaignDTO {
    const campaignDTO = new CampaignDTO();
    campaignDTO.id = campaign._id;
    campaignDTO.name = campaign.name;
    campaignDTO.category = campaign.category.ref;
    campaignDTO.type = campaign.type;
    campaignDTO.description = campaign.description;
    campaignDTO.logo = campaign.logo;
    campaignDTO.geo = campaign.geo;
    campaignDTO.introduction = campaign.introduction;
    campaignDTO.recording_conditions = campaign.recording_conditions;
    campaignDTO.cancel_reasons = campaign.cancel_reasons;
    campaignDTO.commission_policy = campaign.commission_policy;
    campaignDTO.cookie_policy = campaign.cookie_policy;
    campaignDTO.other_notices = campaign.other_notices;
    campaignDTO.traffic_regulation = campaign.traffic_regulation;
    campaignDTO.auto_approve = campaign.auto_approve;
    campaignDTO.datafeed = campaign.datafeed;
    campaignDTO.product_link = "https://khanhlq.com/da-ngon-ngu/";
    campaignDTO.status = status ? status : 0;
    campaignDTO.pub_product_link = pubProductLink
      ? process.env.BASE_URL_PUB_CAMPAIGN + pubProductLink
      : "";
    campaignDTO.short_link = shortLink
      ? process.env.BASE_URL_PUB_CAMPAIGN + shortLink
      : "";
    return campaignDTO;
  }

  public toListCampaign(campaigns: ICampaign[]): ListCampaignDTO[] {
    return campaigns.map((campaign) => {
      return {
        id: campaign._id,
        name: campaign.name,
        logo: campaign.logo,
      };
    });
  }
}

export { CampaignDTO };
