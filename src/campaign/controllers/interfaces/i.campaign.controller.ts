import { Request, Response } from "express";

interface ICampaignController {
  getListCampaignCtrl(req: Request, res: Response): Promise<Response>;
  getCampaignDetailCtrl(req: Request, res: Response): Promise<Response>;
}

export { ICampaignController };
