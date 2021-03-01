import { Request, Response } from "express";
import { validateOrReject } from "class-validator";
import { omitBy, isNil } from "lodash";

import { IUserService } from "../services/interfaces/i.user.service";
import { IUserController } from "./interfaces/i.user.controller";
import { UserDTO, UserUpdateDTO } from "../dtos/user.dto";
import { ResponseDTO } from "../../core/dtos/response.dto";
import { IUser } from "../models/user.model";
import STATUSCODE from "../../constants/statuscode.constant";
import { ResponseMessage } from "../../constants/message.constants";
import { Mailer } from "../../utils/mailer";
import { UrlController } from "../../url/controllers/url.controller";
import { Helper } from "../../utils/helper";
import { createMailRegisterQueue } from "../../queues/queue.create";

class UserController implements IUserController {
  private static userService: IUserService;
  private static userDTO: UserDTO;
  private static userUpdateDTO: UserUpdateDTO;

  constructor(service: IUserService) {
    UserController.userService = service;
    UserController.userDTO = new UserDTO();
    UserController.userUpdateDTO = new UserUpdateDTO();
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
        createMailRegisterQueue.add(
          {
            email: user.email,
            fullname: user.fullname,
            shortUrl: url.short_url,
          },
          { attempts: 3, backoff: 1000, removeOnComplete: true }
        );
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
      const { fullname, phone, birthday } = req.body;
      let userUpdateDTO: UserUpdateDTO;
      try {
        userUpdateDTO = UserController.userUpdateDTO.toUserUpdate(
          fullname,
          email,
          phone,
          Helper.convertStringToDate(birthday)
        );

        await validateOrReject(userUpdateDTO);
      } catch (error) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.NOT_FOUND,
          error
        );
      }

      const userDTOOmit = omitBy(userUpdateDTO, isNil) as IUser;
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

  public async changePassword(req: Request, res: Response): Promise<Response> {
    const email: string = req.user.email;
    const {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.ERROR_CMM,
        ResponseMessage.MISSING_PARAM
      );
    }

    if (newPassword.length < 5 || newPassword.length > 28) {
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.ERROR_CMM,
        ResponseMessage.PASSWORD_WRONG
      );
    }

    if (oldPassword === newPassword || newPassword !== confirmPassword) {
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.ERROR_CMM,
        ResponseMessage.PASSWORD_WRONG
      );
    }
    try {
      const user = await UserController.userService.getUserByEmail(email);
      if (!user) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.NOT_FOUND,
          ResponseMessage.USER_NOT_EXISTED
        );
      }
      const oldPasswordHash = Helper.hashPassword(oldPassword, user.salt);
      if (oldPasswordHash !== user.hashed_password) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.ERROR_CMM,
          ResponseMessage.PASSWORD_WRONG
        );
      }
      const newPasswordHash = Helper.hashPassword(newPassword, user.salt);
      const userUpdate = await UserController.userService.updatePassword(
        email,
        newPasswordHash
      );
      if (!userUpdate) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.ERROR_CMM,
          ResponseMessage.FAIL
        );
      }
      return ResponseDTO.createSuccessResponse(
        res,
        STATUSCODE.SUCCESS,
        ResponseMessage.SUCCESS
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
