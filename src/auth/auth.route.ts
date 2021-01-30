import { AuthController } from "./auth.controller";
import { AuthorizationMDW } from "../middlewares/authorization.middleware";

class AuthRoute {
  private app: any;
  private static authController: AuthController;

  constructor(app: any) {
    this.app = app;
    AuthRoute.authController = new AuthController();
    this.routes();
  }

  public routes(): void {
    this.app.post("/api/v1/auth/login", AuthRoute.authController.login);
    this.app.post(
      "/api/v1/auth/logout",
      AuthorizationMDW.isValidUser,
      AuthRoute.authController.logout
    );
    this.app.get(
      "/api/v1/auth/verify-email",
      AuthRoute.authController.verifyEmail
    );
    this.app.post(
      "/api/v1/auth/access-token",
      AuthRoute.authController.accessToken
    );
  }
}

export { AuthRoute };
