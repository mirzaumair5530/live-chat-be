import express, { Application } from "express";
import mongoose from "mongoose";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import { rateLimit } from "express-rate-limit";
import morgen from "morgan";

import routes from "./routes";
import { SocketIO } from "./socket";
import { Authentication } from "./authentication";

config();

const app: Application = express();

// cors configuration
const corsOptions: CorsOptions = {
  origin: (requestOrigin, callback) => {
    if (
      process.env["WHITELIST_DOMAINS"]?.indexOf(requestOrigin as string) !==
        -1 ||
      !requestOrigin
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Use Helmet!
app.use(helmet());

// configuring rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  requestPropertyName: "rateLimit",
});
app.use(limiter);

// implement logger
app.use(morgen("dev"));

const passportAuthentication = new Authentication(app);

passportAuthentication.setupLocalStratigy()

app.use("/", routes);
const port = process.env.APP_PORT || 3000;

const startApp = async () => {
  try {
    await mongoose.connect(process.env.DB_URI as string).then(() => {
      console.log("Connected with Database.");
    });

    const server = app.listen(port, () => {
      console.log("Server is running on port", port);
    });

    // setting up socket io server
    const socket = new SocketIO(server);

    socket.startConnection();
  } catch (e) {
    console.error(e);
  }
};

startApp();
