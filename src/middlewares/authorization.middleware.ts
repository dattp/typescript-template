import { Request, Response, NextFunction } from "express";
const bluebird = require("bluebird");
const redis = bluebird.promisifyAll(require("redis"));

import { JWTToken } from "../utils/jwt";
import { UserDTO } from "../user/dtos/user.dto";

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

class AuthorizationMDW {
  private static readonly secretToken = process.env
    .ACCESS_TOKEN_SECRET as string;

  public static async isValidUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const userDto = new UserDTO();
    const tokenClient = req.headers["authorization"] as string;

    try {
      const userDecoded = await JWTToken.verifyToken(
        tokenClient,
        AuthorizationMDW.secretToken
      );
      if (!userDecoded) return res.sendStatus(401);
      const refreshToken = req.cookies["refresh_token"];
      const accessToken = await redisClient.getAsync(
        `auth:${userDecoded.data.email}:${refreshToken}`
      );
      if (!accessToken || accessToken !== tokenClient) {
        return res.sendStatus(401);
      }
      req.user = userDto.toUser(userDecoded.data);
      return next();
    } catch (error) {
      console.log(error);
      return res.sendStatus(401);
    }
  }
}

export { AuthorizationMDW };
