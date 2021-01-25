import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import { join } from "path";
const bluebird = require("bluebird");
const redis = bluebird.promisifyAll(require("redis"));

dotenv.config({
  path: join(__dirname, "../.env"),
});

import { UesrRoute } from "./user/routes/user.route";
import { UserController } from "./user/controllers/user.controller";
import { UserService } from "./user/services/user.service";

import { AuthRoute } from "./auth/auth.route";

class App {
  public app: any;

  constructor() {
    console.log("s", process.env.REDIS_PORT);

    this.app = express();
    this._setConfig();
    console.log("s2", process.env.REDIS_PORT);
    this._initMiddlewaresError();
    this._connectMongoConfig();
    this._connectRedis();
    this._loadRoute();
  }

  private _setConfig() {
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(morgan("dev"));
  }

  private _loadRoute() {
    /**
     * init component
     */
    //user
    const userService = new UserService();
    const userController = new UserController(userService);
    new UesrRoute(this.app, userController);

    //auth
    new AuthRoute(this.app);
  }

  private _initMiddlewaresError() {
    // this.app.use("/api", ErrorMiddleware.handleNotFound);
  }

  private _connectMongoConfig() {
    mongoose.Promise = global.Promise;
    mongoose
      .connect(process.env.MONGO_URI + "", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("connected to mongo");
      })
      .catch((error) => console.log(error));
  }

  private _connectRedis() {
    const redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || "6379", 10) || 6379,
    });

    redisClient.on("error", () => {
      console.log(
        "%s Redis connection error. Please make sure Redis is running."
      );
    });
    redisClient.on("connect", () => {
      console.log(`Redis connected on port ${process.env.REDIS_PORT}!`);
    });
  }
}

export default new App().app;
