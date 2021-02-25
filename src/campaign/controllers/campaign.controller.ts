import { Request, Response } from "express";

import { ICampaignController } from "./interfaces/i.campaign.controller";
import { ResponseDTO } from "../../core/dtos/response.dto";
import STATUSCODE from "../../constants/statuscode.constant";
import { ResponseMessage } from "../../constants/message.constants";
import { ICampaignService } from "../services/interfaces/i.campaign.service";
import { CampaignDTO } from "../dtos/campaign.dto";
import { IPubCampaignService } from "../services/interfaces/i.pub-campaign.service";

class CampaignController implements ICampaignController {
  private static campaignService: ICampaignService;
  private static pubCampaignService: IPubCampaignService;
  private static campaignDTO: CampaignDTO;

  constructor(
    service: ICampaignService,
    pubCampaignService: IPubCampaignService
  ) {
    CampaignController.campaignService = service;
    CampaignController.pubCampaignService = pubCampaignService;
    CampaignController.campaignDTO = new CampaignDTO();
  }

  public async getListCampaignCtrl(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const campaigns = await CampaignController.campaignService.getListCampaign();
      return ResponseDTO.createSuccessResponse(
        res,
        STATUSCODE.SUCCESS,
        CampaignController.campaignDTO.toListCampaign(campaigns)
      );
    } catch (error) {
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error.message
      );
    }
  }

  public async getCampaignDetailCtrl(
    req: Request,
    res: Response
  ): Promise<Response> {
    const campaignId: string = req.params.id;
    if (!campaignId) {
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.ERROR_CMM,
        ResponseMessage.MISSING_PARAM
      );
    }
    try {
      const [campaign, pubCampaign] = await Promise.all([
        CampaignController.campaignService.getCampaign(campaignId),
        CampaignController.pubCampaignService.getPubCampaignByPubAndCampaign(
          req.user.id,
          campaignId
        ),
      ]);

      if (!campaign) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.NOT_FOUND,
          ResponseMessage.NOT_FOUND
        );
      }
      return ResponseDTO.createSuccessResponse(
        res,
        STATUSCODE.SUCCESS,
        CampaignController.campaignDTO.toCampaign(
          campaign,
          pubCampaign?.status,
          pubCampaign?.pub_product_link,
          pubCampaign?.short_link
        )
      );
    } catch (error) {
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error.message
      );
    }
  }
}

export { CampaignController };
