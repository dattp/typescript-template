import { Request, Response } from "express";
import { validateOrReject } from "class-validator";
import { omitBy, isEmpty } from "lodash";

import { IUserService } from "../services/interfaces/i.user.service";
import { IUserController } from "./interfaces/i.user.controller";
import { UserDTO } from "../dtos/user.dto";
import { ResponseDTO } from "../../core/dtos/response.dto";
import { IUser } from "../models/user.model";
import STATUSCODE from "../../constants/statuscode.constant";
import { ResponseMessage } from "../../constants/message.constants";
import { Mailer } from "../../utils/mailer";
import { UrlController } from "../../url/controllers/url.controller";
import { Helper } from "../../utils/helper";

class UserController implements IUserController {
  private static userService: IUserService;
  private static userDTO: UserDTO;

  constructor(service: IUserService) {
    UserController.userService = service;
    UserController.userDTO = new UserDTO();
  }

  public async getUserByEmail(req: Request, res: Response): Promise<Response> {
    try {
      const email = req.query.email as string;
      const user = await UserController.userService.getUserByEmail(email);
      if (user) {
        return ResponseDTO.createSuccessResponse(
          res,
          STATUSCODE.SUCCESS,
          UserController.userDTO.toUser(user)
        );
      }
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.NOT_FOUND,
        ResponseMessage.USER_NOT_EXISTED
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
      const user: UserDTO = req.body;

      if (!user) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.NOT_FOUND,
          ResponseMessage.MISSING_PARAM
        );
      }
      let userDTO: UserDTO;
      try {
        userDTO = UserController.userDTO.toUserCreate(user);
        await validateOrReject(userDTO);
      } catch (error) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.NOT_FOUND,
          error
        );
      }
      const userExist = await UserController.userService.getUserByEmail(
        userDTO.getEmail()
      );

      if (userExist) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.ERROR_CMM,
          ResponseMessage.USER_EXISTED
        );
      }
      const salt = Helper.createSalt();
      const passwordHash = Helper.hashPassword(userDTO.getPassword(), salt);
      const userModel = UserController.userDTO.toUserModel(
        userDTO,
        passwordHash,
        salt
      );
      const userCreate = await UserController.userService.register(userModel);
      if (userCreate) {
        UserController.verifyEmailRegister(userCreate);
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

  // add queue
  public static async verifyEmailRegister(user: IUser): Promise<void> {
    try {
      const shortUrlObj = await UrlController.createShortUrlCtl(user.email);
      if (ResponseDTO.isSuccess(shortUrlObj)) {
        const url = ResponseDTO.getData(shortUrlObj);
        Mailer.mailVerify(user.email, user.fullname, url.short_url);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getInfoUser(req: Request, res: Response): Promise<Response> {
    try {
      const email: string = req.user.email;
      const user = await UserController.userService.getUserByEmail(email);
      if (user) {
        return ResponseDTO.createSuccessResponse(
          res,
          STATUSCODE.SUCCESS,
          UserController.userDTO.toUser(user)
        );
      }
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.NOT_FOUND,
        ResponseMessage.USER_NOT_EXISTED
      );
    } catch (error) {
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error.message
      );
    }
  }

  public async editProfile(req: Request, res: Response): Promise<Response> {
    try {
      const email: string = req.user.email;
      const { fullname, password } = req.body;

      let passwordHash = password;

      if (password) {
        const salt = Helper.createSalt();
        passwordHash = Helper.hashPassword(password, salt);
      }

      const userDTO = UserController.userDTO.toUserUpdate(
        fullname,
        passwordHash,
        email
      );
      const userDTOOmit = omitBy(userDTO, isEmpty) as IUser;
      const userUpdate = await UserController.userService.updateProfile(
        userDTOOmit
      );
      if (userUpdate) {
        return ResponseDTO.createSuccessResponse(
          res,
          STATUSCODE.SUCCESS,
          ResponseMessage.SUCCESS
        );
      }
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.ERROR_CMM,
        ResponseMessage.FAIL
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

export { UserController };
