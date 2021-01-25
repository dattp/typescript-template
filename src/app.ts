import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import { join } from "path";

import { UesrRoute } from "./user/routes/user.route";
import { UserController } from "./user/controllers/user.controller";
import { UserService } from "./user/services/user.service";

class App {
  public app: any;

  constructor() {
    this.app = express();
    this._setConfig();
    this._initMiddlewaresError();
    this._setMongoConfig();
    this._loadRoute();
  }

  private _setConfig() {
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(morgan("dev"));
    dotenv.config({
      path: join(__dirname, "../.env"),
    });
  }

  private _loadRoute() {
    /**
     * init component
     */
    const userService = new UserService();
    const userController = new UserController(userService);
    new UesrRoute(this.app, userController);
  }

  private _initMiddlewaresError() {
    // this.app.use("/api", ErrorMiddleware.handleNotFound);
  }

  private _setMongoConfig() {
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
}

export default new App().app;
