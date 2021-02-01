import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { join } from "path";
import swaggerUi from "swagger-ui-express";
import basicAuth from "express-basic-auth";

const bluebird = require("bluebird");
const redis = bluebird.promisifyAll(require("redis"));

dotenv.config({
  path: join(__dirname, "../.env"),
});

import * as swaggerDocument from "./configs/swaggers/swagger.config.json";

import { UserRoute } from "./user/routes/user.route";
import { UserController } from "./user/controllers/user.controller";
import { UserService } from "./user/services/user.service";

import { AuthRoute } from "./auth/auth.route";

import { UrlRoute } from "./url/routes/url.route";
import { UrlController } from "./url/controllers/url.controller";
import { UrlService } from "./url/services/url.service";

class App {
  public app: any;

  constructor() {
    this.app = express();
    this._setConfig();
    this._initMiddlewaresError();
    this._connectMongoConfig();
    this._connectRedis();
    this._loadRoute();
  }

  private _setConfig() {
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(morgan("dev"));
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(
      "/api-docs",
      basicAuth({
        users: { a22z: "a22z" },
        challenge: true,
        realm: "Imb4T3st4pp",
      }),
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }

  private _loadRoute() {
    /**
     * init component
     */
    //user
    const userService = new UserService();
    const userController = new UserController(userService);
    new UserRoute(this.app, userController);

    //auth
    new AuthRoute(this.app);

    //url
    const urlService = new UrlService();
    const urlController = new UrlController(urlService);
    new UrlRoute(this.app, urlController);
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
