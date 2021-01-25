import { Request, Response } from "express";
import { validateOrReject } from "class-validator";

import { IUserService } from "../services/interfaces/i.user.service";
import { IUserController } from "./interfaces/i.user.controller";
import { UserDTO } from "../dtos/user.dto";
import { ResponseDTO } from "../dtos/response.dto";
import STATUSCODE from "../../constants/statuscode.constant";
import { IUser } from "../models/user.model";

class UserController implements IUserController {
  private static userService: IUserService;
  private static userDTO: UserDTO;

  constructor(service: IUserService) {
    UserController.userService = service;
    UserController.userDTO = new UserDTO();
  }

  public async getUserByUsername(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const username = req.query.username as string;
      const user = await UserController.userService.getUserByUsername(username);
      return ResponseDTO.createSuccessResponse(
        res,
        STATUSCODE.SUCCESS,
        UserController.userDTO.toUser(user)
      );
    } catch (error) {
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error
      );
    }
  }

  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const user: IUser = req.body;
      if (!user) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.NOT_FOUND,
          "Missing body data"
        );
      }
      let userDTO: UserDTO;
      try {
        userDTO = UserController.userDTO.toUser(user);
        await validateOrReject(userDTO);
      } catch (error) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.NOT_FOUND,
          error
        );
      }
      const userExist = await await UserController.userService.getUserByUsername(
        userDTO.getUsername()
      );

      if (userExist) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.ERROR_CMM,
          "user existed"
        );
      }

      const userCreate = await UserController.userService.register(userDTO);
      if (userCreate) {
        return ResponseDTO.createSuccessResponse(
          res,
          STATUSCODE.SUCCESS,
          "success"
        );
      }
      return ResponseDTO.createErrorResponse(res, STATUSCODE.NOT_FOUND, "fail");
    } catch (error) {
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error
      );
    }
  }
}

export { UserController };
