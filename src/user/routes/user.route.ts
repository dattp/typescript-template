import { IUserController } from "../controllers/interfaces/i.user.controller";
import { IUserRoute } from "./interfaces/i.iser.route";

class UesrRoute implements IUserRoute {
  private app: any;
  private userController: IUserController;

  constructor(app: any, controller: IUserController) {
    this.app = app;
    this.userController = controller;
    this.routes();
  }

  public routes(): void {
    this.app.get("/api/user", this.userController.getUserByUsername);
  }
}

export { UesrRoute };
