import { Request, Response } from "express";

import { IUserService } from "../services/interfaces/i.user.service";
import { IUserController } from "./interfaces/i.user.controller";
import { UserDTO } from "../dtos/user.dto";
import { ResponseDTO } from "../dtos/response.dto";
import STATUSCODE from "../../constants/statuscode.constant";
// import { UserService } from "../services/user.service";

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
}

export { UserController };
