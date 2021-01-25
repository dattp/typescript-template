import { AuthController } from "./auth.controller";

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
      "/api/v1/auth/access-token",
      AuthRoute.authController.accessToken
    );
  }
}

export { AuthRoute };
