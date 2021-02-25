import { Request, Response } from "express";

interface IPubCampaignController {
  registerCampaignCtrl(req: Request, res: Response): Promise<Response>;
  clickProductLink(req: Request, res: Response): Promise<Response>;
  clickShortLink(req: Request, res: Response): Promise<Response>;
  getListCampaignRegistered(req: Request, res: Response): Promise<Response>;
}

export { IPubCampaignController };
