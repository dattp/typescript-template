/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

dotenv.config({ path: path.join(__dirname, ".env") });

app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_, res) => {
  res.sendStatus(200);
});

/**
 * require route
 */
require("./media.route").setup(app);

app.set("host", process.env.HOST || "127.0.0.1");
app.set("port", process.env.PORT_MEDIA || 8060);
app.listen(app.get("port"), () => {
  console.log(
    "%s 😍 Server is running on %d in %s mode",
    app.get("host"),
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});
