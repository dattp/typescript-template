import { Request, Response } from "express";

interface IUserController {
  getUserByUsername(req: Request, res: Response): Promise<Response>;
}

export { IUserController };
