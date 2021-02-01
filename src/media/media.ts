import express from "express";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import logger from "morgan";
import helmet from "helmet";
import cors from "cors";

const app = express();

dotenv.config({ path: path.join(__dirname, "../../.env") });

app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_, res) => {
  res.sendStatus(200);
});

import { MediaRoute } from "./media.route";
new MediaRoute(app);

app.set("host", process.env.HOST || "127.0.0.1");
app.set("port", process.env.PORT_MEDIA || 8060);
app.listen(app.get("port"), () => {
  console.log(
    "%s 😍 Server media is running on %d in %s mode",
    app.get("host"),
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});
