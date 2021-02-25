import { IsNotEmpty, IsString, IsNumber } from "class-validator";

import {
  IPubCampaign,
  StatusRegisterCampagin,
} from "../models/pub-campaign.model";

class PubCampaignDTO {
  private id: string;

  @IsNotEmpty()
  @IsString()
  private pub: string;

  @IsNotEmpty()
  @IsString()
  private campaign: string;

  @IsNotEmpty()
  @IsString()
  private pub_email: string;

  @IsNotEmpty()
  @IsString()
  private campaign_id: string;

  private register_time: Date;

  @IsNotEmpty()
  @IsNumber()
  private status: StatusRegisterCampagin;

  private updated_time: Date;

  @IsNotEmpty()
  @IsString()
  private pub_product_link: string;

  @IsString()
  private short_link: string;

  constructor() {
    this.id = "";
    this.pub = "";
    this.campaign = "";
    this.pub_email = "";
    this.campaign_id = "";
    this.register_time = new Date();
    this.status = StatusRegisterCampagin.pedding;
    this.updated_time = new Date();
    this.pub_product_link = "";
    this.short_link = "";
  }

  public toPubCampaign(pubCampaign: IPubCampaign): PubCampaignDTO {
    const pubCampaignDTO = new PubCampaignDTO();
    pubCampaignDTO.id = pubCampaign._id;
    pubCampaignDTO.pub = pubCampaign.pub;
    pubCampaignDTO.campaign = pubCampaign.campaign;
    pubCampaignDTO.pub_email = pubCampaign.pub_email;
    pubCampaignDTO.campaign_id = pubCampaign.campaign_id;
    pubCampaignDTO.register_time = pubCampaign.register_time;
    pubCampaignDTO.status = pubCampaign.status;
    pubCampaignDTO.updated_time = pubCampaign.updated_time;
    pubCampaignDTO.pub_product_link =
      process.env.BASE_URL_PUB_CAMPAIGN + pubCampaign.pub_product_link;
    pubCampaignDTO.short_link =
      process.env.BASE_URL_PUB_CAMPAIGN + pubCampaign.short_link;
    return pubCampaignDTO;
  }

  public toCreatePubCampaign(
    pub: string,
    campaign: string,
    pubEmail: string,
    campaignId: string,
    status: number,
    productLink: string,
    shortLink: string
  ): PubCampaignDTO {
    const pubCampaignDTO = new PubCampaignDTO();
    pubCampaignDTO.pub = pub;
    pubCampaignDTO.campaign = campaign;
    pubCampaignDTO.pub_email = pubEmail;
    pubCampaignDTO.campaign_id = campaignId;
    pubCampaignDTO.register_time = new Date();
    pubCampaignDTO.status = status;
    pubCampaignDTO.updated_time = new Date();
    pubCampaignDTO.pub_product_link =
      status === StatusRegisterCampagin.registed ? productLink : "";
    pubCampaignDTO.short_link =
      status === StatusRegisterCampagin.registed ? shortLink : "";
    return pubCampaignDTO;
  }
}

export { PubCampaignDTO };
