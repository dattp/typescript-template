import { Request, Response } from "express";
const bluebird = require("bluebird");
const redis = bluebird.promisifyAll(require("redis"));

import { JWTToken } from "../utils/jwt";
import { UserService } from "../user/services/user.service";
import { Helper } from "../utils/helper";
import STATUSCODE from "../constants/statuscode.constant";
import { ResponseMessage } from "../constants/message.constants";
import { ResponseDTO } from "../core/dtos/response.dto";

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
});

class AuthController {
  private static readonly secretToken = process.env
    .ACCESS_TOKEN_SECRET as string;
  private static readonly secretTokenTime = process.env
    .ACCESS_TOKEN_TIME as string;
  private static readonly refreshTokenSecret = process.env
    .REFRESH_TOKEN_SECRET as string;
  private static readonly refreshTokenTime = process.env
    .REFRESH_TOKEN_TIME as string;

  public async login(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;
    const userService = new UserService();
    try {
      const user = await userService.getUserByUsername(username);

      if (user && Helper.validatePassword(password, user.password, user.salt)) {
        const refreshToken = await JWTToken.generateToken(
          user,
          AuthController.refreshTokenSecret,
          AuthController.refreshTokenTime
        );
        const accessToken = await JWTToken.generateToken(
          { ...user, refresh_token: refreshToken },
          AuthController.secretToken,
          AuthController.secretTokenTime
        );
        await redisClient.setAsync(`auth:${refreshToken}`, accessToken);
        await redisClient.expire(`auth:${refreshToken}`, 60 * 60 * 24 * 365);

        return ResponseDTO.createSuccessResponse(res, STATUSCODE.SUCCESS, {
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.ERROR_CMM,
        ResponseMessage.USER_EXISTED
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

  public async accessToken(req: Request, res: Response): Promise<Response> {
    const refreshToken = req.body.refresh_token;
    const tokenExisted = await redisClient.existsAsync(`auth:${refreshToken}`);
    if (refreshToken && tokenExisted) {
      try {
        const decoded = await JWTToken.verifyToken(
          refreshToken,
          AuthController.refreshTokenSecret
        );
        const user = decoded.data;
        const accessToken = await JWTToken.generateToken(
          { ...user, refresh_token: refreshToken },
          AuthController.secretToken,
          AuthController.secretTokenTime
        );
        await redisClient.setAsync(`auth:${refreshToken}`, accessToken);
        await redisClient.expire(`auth:${refreshToken}`, 60 * 60 * 24 * 365);
        return ResponseDTO.createSuccessResponse(res, STATUSCODE.SUCCESS, {
          access_token: accessToken,
        });
      } catch (error) {
        console.log(error);
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.SERVER_ERROR,
          error
        );
      }
    } else {
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.ERROR_CMM,
        ResponseMessage.USER_NOT_EXISTED
      );
    }
  }
}

export { AuthController };
