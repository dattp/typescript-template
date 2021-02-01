import multer from "multer";

import { MediaController } from "./media.controller";
import { AuthorizationMDW } from "../middlewares/authorization.middleware";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
  },
  filename(req, file, cb) {
    const { username } = req.user;
    const dateNow = new Date();
    const times = [
      dateNow.getMonth() + 1,
      dateNow.getDate(),
      dateNow.getHours(),
      dateNow.getMinutes(),
      dateNow.getSeconds(),
    ];
    cb(null, `${username}-${times.join("-")}`);
  },
});

const upload = multer({ storage });

class MediaRoute {
  private app: any;

  constructor(app: any) {
    this.app = app;
    this.routes();
  }

  public routes(): void {
    const mediaController: MediaController = new MediaController();
    this.app.post(
      "/api/v1/image",
      AuthorizationMDW.isValidUser,
      upload.single("image"),
      mediaController.uploadImage
    );
    this.app.get("/api/v1/image/:image", mediaController.getImage);
  }
}

export { MediaRoute };
