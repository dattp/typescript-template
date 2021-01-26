import { Request, Response } from "express";

interface IUrlController {
  getFullUrlByShortUrl(req: Request, res: Response): Promise<Response>;
  createUrl(req: Request, res: Response): Promise<Response>;
}

export { IUrlController };
