import { Request, Response } from "express";
import { validateOrReject } from "class-validator";
import shortid from "shortid";
import { isEmpty, map } from "lodash";
import { Types } from "mongoose";

import { ResponseDTO } from "../../core/dtos/response.dto";
import STATUSCODE from "../../constants/statuscode.constant";
import { ResponseMessage } from "../../constants/message.constants";
import { IPubCampaignController } from "./interfaces/i.pub-campaign.controller";
import { IPubCampaignService } from "../services/interfaces/i.pub-campaign.service";
import { PubCampaignDTO } from "../dtos/pub-campaign.dto";
import { ICampaignService } from "../services/interfaces/i.campaign.service";
import { StatusRegisterCampagin } from "../models/pub-campaign.model";
import { URL } from "../../constants/url.constants";
import { CampaignDTO } from "../dtos/campaign.dto";

class PubCampaignController implements IPubCampaignController {
  private static pubCampaignService: IPubCampaignService;
  private static campaignService: ICampaignService;
  private static pubCampaignDTO: PubCampaignDTO;
  private static campaignDTO: CampaignDTO;

  constructor(
    pubCampaignService: IPubCampaignService,
    campaignService: ICampaignService
  ) {
    PubCampaignController.pubCampaignService = pubCampaignService;
    PubCampaignController.campaignService = campaignService;
    PubCampaignController.pubCampaignDTO = new PubCampaignDTO();
    PubCampaignController.campaignDTO = new CampaignDTO();
  }

  public async registerCampaignCtrl(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const campaignId: string = req.body.id;
      if (!campaignId) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.ERROR_CMM,
          ResponseMessage.MISSING_PARAM
        );
      }

      const campaign = await PubCampaignController.campaignService.getCampaign(
        campaignId
      );
      if (!campaign) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.NOT_FOUND,
          ResponseMessage.NOT_FOUND
        );
      }
      let pubCampaignDTO = new PubCampaignDTO();
      const status = campaign.auto_approve
        ? StatusRegisterCampagin.registed
        : StatusRegisterCampagin.pedding;
      const shorUrl: string = shortid.generate();
      const productLink = campaign.product_link
        ? campaign.product_link
        : "https://khanhlq.com/da-ngon-ngu/";
      const pubProductLink = `${req.user.id}/${campaignId}?url_product=${productLink}`;

      try {
        pubCampaignDTO = PubCampaignController.pubCampaignDTO.toCreatePubCampaign(
          req.user.id,
          campaignId,
          req.user.email,
          campaign.camp_id,
          status,
          pubProductLink,
          shorUrl
        );
        await validateOrReject(pubCampaignDTO);
      } catch (error) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.NOT_FOUND,
          error
        );
      }
      try {
        const campaignsJoin = await PubCampaignController.pubCampaignService.registerCampaign(
          pubCampaignDTO
        );
        return ResponseDTO.createSuccessResponse(
          res,
          STATUSCODE.SUCCESS,
          PubCampaignController.pubCampaignDTO.toPubCampaign(campaignsJoin)
        );
      } catch (error) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.ERROR_CMM,
          ResponseMessage.FAIL
        );
      }
    } catch (error) {
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error.message
      );
    }
  }

  public async getListCampaignRegistered(
    req: Request,
    res: Response
  ): Promise<Response> {
    const status = req.query.status as string;

    try {
      const statusPubCapaign = parseInt(status, 10);

      const pubCampaigns = await PubCampaignController.pubCampaignService.getListCampaignByPub(
        req.user.email,
        statusPubCapaign
      );
      if (isEmpty(pubCampaigns)) {
        return ResponseDTO.createSuccessResponse(res, STATUSCODE.SUCCESS, []);
      }

      const pubCampaignIds: string[] = map(pubCampaigns, "campaign");

      const campaigns = await PubCampaignController.campaignService.getListCampaign(
        pubCampaignIds
      );
      return ResponseDTO.createSuccessResponse(
        res,
        STATUSCODE.SUCCESS,
        PubCampaignController.campaignDTO.toListCampaign(campaigns)
      );
    } catch (error) {
      console.log(error);
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error
      );
    }
  }

  public async clickProductLink(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const pub: string = req.params.user;
      const campaign: string = req.params.campaign;
      let urlProduct: string = req.query.url_product as string;
      if (!pub || !campaign || !urlProduct) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.NOT_FOUND,
          ResponseMessage.NOT_FOUND
        );
      }
      const pubCampaign = await PubCampaignController.pubCampaignService.getPubCampaignByPubAndCampaign(
        pub,
        campaign
      );
      if (!pubCampaign) {
        urlProduct = URL.NOT_FOUND;
      }
      res.writeHead(301, {
        Location: urlProduct,
      });
      res.end();

      // queue xu ly log user click link

      return res;
    } catch (error) {
      console.log(error);
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error
      );
    }
  }

  public async clickShortLink(req: Request, res: Response): Promise<Response> {
    try {
      const shortLink: string = req.params.short_link;
      if (!shortLink) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.NOT_FOUND,
          ResponseMessage.NOT_FOUND
        );
      }
      const pubCampaign = await PubCampaignController.pubCampaignService.getPubCampaignByShortLink(
        shortLink
      );
      let urlRedirect = URL.NOT_FOUND;
      if (pubCampaign) {
        urlRedirect = pubCampaign.pub_product_link.split("url_product=", 2)[1];
      }
      res.writeHead(301, {
        Location: urlRedirect,
      });

      // queue xu ly user click link

      res.end();
      return res;
    } catch (error) {
      console.log(error);
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error
      );
    }
  }
}

export { PubCampaignController };
