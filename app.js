import express from "express";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

import user from "./routes/userRoutes.js";
import content from "./routes/contentRoutes.js";
import review from "./routes/reviewRoutes.js";
import payment from "./routes/paymentRoutes.js";
import livestream from "./routes/liveStreamingRoutes.js";
import episodes from "./routes/episodesRoutes.js";
import analytics from "./routes/analyticsRoutes.js";

app.use("/api/v1", user);
app.use("/api/v1", content);
app.use("/api/v1", review);
app.use("/api/v1", payment);
app.use("/api/v1", livestream);
app.use("/api/v1", episodes);
app.use("/api/v1", analytics);

app.use(errorHandler);
export default app;
