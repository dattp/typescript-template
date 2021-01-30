import { IUrlController } from "../controllers/interfaces/i.url.controller";
import { IUrlRoute } from "./interfaces/i.url.route";

class UrlRoute implements IUrlRoute {
  private app: any;
  private urlController: IUrlController;

  constructor(app: any, controller: IUrlController) {
    this.app = app;
    this.urlController = controller;
    this.routes();
  }

  public routes(): void {
    this.app.get("/:short_url", this.urlController.getFullUrlByShortUrl);
    this.app.post("/pub/api/v1/url", this.urlController.createUrl);
  }
}

export { UrlRoute };
