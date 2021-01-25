import { Request, Response } from "express";
import { validateOrReject } from "class-validator";

import { IUserService } from "../services/interfaces/i.user.service";
import { IUserController } from "./interfaces/i.user.controller";
import { UserDTO } from "../dtos/user.dto";
import { ResponseDTO } from "../../core/dtos/response.dto";
import { IUser } from "../models/user.model";
import STATUSCODE from "../../constants/statuscode.constant";
import { ResponseMessage } from "../../constants/message.constants";
import { Mailer } from "../../utils/mailer";

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
          ResponseMessage.MISSING_PARAM
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
          ResponseMessage.USER_EXISTED
        );
      }

      const userCreate = await UserController.userService.register(userDTO);
      if (userCreate) {
        Mailer.mailVerify(userDTO.getEmail(), userDTO.getFullname());

        return ResponseDTO.createSuccessResponse(
          res,
          STATUSCODE.SUCCESS,
          ResponseMessage.SUCCESS
        );
      }
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.NOT_FOUND,
        ResponseMessage.FAIL
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
}

export { UserController };
