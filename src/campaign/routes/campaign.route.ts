import { ICampaignController } from "../controllers/interfaces/i.campaign.controller";
import { ICampaignRoute } from "./interfaces/i.campaign.route";
import { AuthorizationMDW } from "../../middlewares/authorization.middleware";
import { IPubCampaignController } from "../controllers/interfaces/i.pub-campaign.controller";

class CampaignRoute implements ICampaignRoute {
  private app: any;
  private campaignController: ICampaignController;
  private pubCampaignController: IPubCampaignController;
  constructor(
    app: any,
    campaignController: ICampaignController,
    pubCampaignController: IPubCampaignController
  ) {
    this.app = app;
    this.campaignController = campaignController;
    this.pubCampaignController = pubCampaignController;
    this.routes();
  }

  public routes(): void {
    try {
      this.app.get(
        "/api/v1/campaigns",
        AuthorizationMDW.isValidUser,
        this.campaignController.getListCampaignCtrl
      );

      this.app.get(
        "/api/v1/campaigns/registered",
        AuthorizationMDW.isValidUser,
        this.pubCampaignController.getListCampaignRegistered
      );

      this.app.get(
        "/api/v1/campaigns/:id",
        AuthorizationMDW.isValidUser,
        this.campaignController.getCampaignDetailCtrl
      );

      this.app.post(
        "/api/v1/campaigns/register",
        AuthorizationMDW.isValidUser,
        this.pubCampaignController.registerCampaignCtrl
      );

      this.app.get(
        "/campaigns/:user/:campaign",
        this.pubCampaignController.clickProductLink
      );

      this.app.get(
        "/campaigns/:short_link",
        this.pubCampaignController.clickShortLink
      );
    } catch (error) {
      console.log(error);
    }
  }
}

export { CampaignRoute };
