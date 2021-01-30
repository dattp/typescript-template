import { Request, Response } from "express";
const bluebird = require("bluebird");
const redis = bluebird.promisifyAll(require("redis"));

import { JWTToken } from "../utils/jwt";
import { UserService } from "../user/services/user.service";
import { Helper } from "../utils/helper";
import STATUSCODE from "../constants/statuscode.constant";
import STATUSUSER from "../constants/statususer.constant";
import { ResponseMessage } from "../constants/message.constants";
import { ResponseDTO } from "../core/dtos/response.dto";
import { UrlService } from "../url/services/url.service";

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
      if (user && user.status === STATUSUSER.PENDING) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.ERROR_CMM,
          ResponseMessage.USER_NOT_ACTIVE
        );
      }
      if (
        user &&
        user.status === STATUSUSER.ACTIVE &&
        Helper.validatePassword(password, user.password, user.salt)
      ) {
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

  public async logout(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken: string = req.user.refresh_token as string;
      const result = await redisClient.delAsync(`auth:${refreshToken}`);
      if (result) {
        return ResponseDTO.createSuccessResponse(
          res,
          STATUSCODE.SUCCESS,
          ResponseMessage.SUCCESS
        );
      } else {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.ERROR_CMM,
          ResponseMessage.FAIL
        );
      }
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

  public async verifyEmail(req: Request, res: Response): Promise<Response> {
    const short = req.query.short as string;
    const token = req.query.token as string;
    try {
      if (!short || !token) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.ERROR_CMM,
          ResponseMessage.MISSING_PARAM
        );
      }
      let urlRedirect = "http://localhost:9000/not-found";
      const userService = new UserService();
      const urlService = new UrlService();
      const url = await urlService.getlUrl(short);
      // if (user && user.token === token) {
      if (url && url.token === token) {
        const updateStatusUser = await userService.updateStatusUser(
          url.username,
          STATUSUSER.ACTIVE
        );
        if (updateStatusUser) {
          urlRedirect = process.env.PUB_LOGIN as string;
          res.writeHead(301, {
            Location: urlRedirect,
          });
          res.end();
          return res;
        }
      }
      res.writeHead(301, {
        Location: urlRedirect,
      });
      res.end();
      return res;
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

export { AuthController };
