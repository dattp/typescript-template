import { Request, Response } from "express";

interface IUserController {
  getUserByUsername(req: Request, res: Response): Promise<Response>;
  getInfoUser(req: Request, res: Response): Promise<Response>;
  register(req: Request, res: Response): Promise<Response>;
  editProfile(req: Request, res: Response): Promise<Response>;
}

export { IUserController };
