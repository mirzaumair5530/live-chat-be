import express, { Request, Response, Application } from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import { rateLimit } from "express-rate-limit";
import morgen from "morgan"
import routes from "./routes"

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
  requestPropertyName: "rateLimit"
});
app.use(limiter);


// implement logger
app.use(morgen("dev"))

app.use("/", routes)

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port", port);
});
