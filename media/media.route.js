/* eslint-disable @typescript-eslint/no-var-requires */
const multer = require("multer");

const RouteController = require("./media.controller");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
  },
  filename(req, file, cb) {
    const { name } = req.body;
    const dateNow = new Date();
    const times = [
      dateNow.getMonth() + 1,
      dateNow.getDate(),
      dateNow.getHours(),
      dateNow.getMinutes(),
      dateNow.getSeconds(),
    ];
    cb(null, `${name}_${times.join("-")}`);
  },
});

const upload = multer({ storage });

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.setup = (app) => {
  app.post(
    "/api/v1/image",
    upload.single("image"),
    RouteController.uploadImage
  );
};
