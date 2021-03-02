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
import { URL } from "../constants/url.constants";
import { UserJWTDTO } from "../user/dtos/user.dto";

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
});

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

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
    const { email, password } = req.body;

    const userService = new UserService();
    const userDto = new UserJWTDTO();

    try {
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.ERROR_CMM,
          ResponseMessage.USER_NOT_EXISTED
        );
      }
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
        Helper.validatePassword(password, user.hashed_password, user.salt)
      ) {
        const refreshToken = await JWTToken.generateToken(
          userDto.toUserJWT(user),
          AuthController.refreshTokenSecret,
          AuthController.refreshTokenTime
        );
        const accessToken = await JWTToken.generateToken(
          userDto.toUserJWT(user),
          AuthController.secretToken,
          AuthController.secretTokenTime
        );
        await redisClient.setAsync(
          `auth:${user.email}:${refreshToken}`,
          accessToken
        );
        await redisClient.expire(
          `auth:${user.email}:${refreshToken}`,
          60 * 60 * 24 * 365
        );
        res.cookie("refresh_token", refreshToken, {
          maxAge: 60 * 60 * 24 * 365,
          httpOnly: true,
          secure: false,
        });

        return ResponseDTO.createSuccessResponse(res, STATUSCODE.SUCCESS, {
          access_token: accessToken,
        });
      }
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.ERROR_CMM,
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

  public async logout(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken: string = req.cookies["refresh_token"];

      const result = await redisClient.delAsync(
        `auth:${req.user.email}:${refreshToken}`
      );
      if (result) {
        res.cookie("refresh_token", "", {
          httpOnly: true,
          expires: new Date(0),
        });
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
    const refreshToken = req.cookies["refresh_token"];
    try {
      const refreshTokenDecoded = await JWTToken.verifyToken(
        refreshToken,
        AuthController.refreshTokenSecret
      );

      const user = refreshTokenDecoded.data;
      const accessTokenInDB = await redisClient.getAsync(
        `auth:${user.email}:${refreshToken}`
      );

      if (refreshToken && accessTokenInDB) {
        try {
          // const accessToken = await JWTToken.generateToken(
          //   user,
          //   AuthController.secretToken,
          //   AuthController.secretTokenTime
          // );

          // const refreshTokenNew = await JWTToken.generateToken(
          //   {
          //     email: req.user.email,
          //   },
          //   AuthController.refreshTokenSecret,
          //   AuthController.refreshTokenTime
          // );

          const [accessToken, refreshTokenNew] = await Promise.all([
            JWTToken.generateToken(
              user,
              AuthController.secretToken,
              AuthController.secretTokenTime
            ),
            JWTToken.generateToken(
              {
                email: user.email,
              },
              AuthController.refreshTokenSecret,
              AuthController.refreshTokenTime
            ),
          ]);

          await redisClient.setAsync(
            `auth:${user.email}:${refreshTokenNew}`,
            accessToken
          );
          await redisClient.expire(
            `auth:${user.email}:${refreshTokenNew}`,
            60 * 60 * 24 * 365
          );
          await redisClient.delAsync(`auth:${user.email}:${refreshToken}`);

          res.cookie("refresh_token", refreshTokenNew, {
            maxAge: 60 * 60 * 24 * 365,
            httpOnly: true,
            secure: false,
          });

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
    } catch (error) {
      console.log(error);
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error
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
      let urlRedirect = URL.NOT_FOUND;
      const userService = new UserService();
      const urlService = new UrlService();
      const url = await urlService.getlUrl(short);
      // if (user && user.token === token) {
      if (url && url.token === token) {
        const updateStatusUser = await userService.updateStatusUser(
          url.email,
          STATUSUSER.ACTIVE
        );
        if (updateStatusUser) {
          urlRedirect = process.env.PUB_LOGIN as string;
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
