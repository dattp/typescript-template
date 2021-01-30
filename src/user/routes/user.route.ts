import { IUserController } from "../controllers/interfaces/i.user.controller";
import { IUserRoute } from "./interfaces/i.iser.route";
import { AuthorizationMDW } from "../../middlewares/authorization.middleware";

class UserRoute implements IUserRoute {
  private app: any;
  private userController: IUserController;

  constructor(app: any, controller: IUserController) {
    this.app = app;
    this.userController = controller;
    this.routes();
  }

  public routes(): void {
    this.app.get(
      "/api/v1/user",
      AuthorizationMDW.isValidUser,
      this.userController.getUserByUsername
    );
    this.app.post("/api/v1/user", this.userController.register);
  }
}

export { UserRoute };
