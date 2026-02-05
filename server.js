const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { sequelize } = require("./models");
const { errorHandler } = require("./middlewares/error.middleware.js");
const { port, clientUrl } = require("./config/config.js");
const routes = require("./routes");

const app = express();

app.use(helmet());

const clients = clientUrl.split(",").map((url) => url.trim());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
      credentials: true,    
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.set("trust proxy", true);

app.use((req, res, next) => {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip;

  if (ip === "::1") ip = "127.0.0.1";
  if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");

  req.clientIp = ip;
  next();
});

app.use((req, res, next) => {
  console.log(`${new Date().toUTCString()} ${req.method} ${req.url}`);
  next();
});

app.use(routes);


app.use(errorHandler);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    process.exit(1);
  }
})();
