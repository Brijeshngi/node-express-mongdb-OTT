import { config } from "dotenv";
import { mongoDBConnect } from "./config/database.js";

config({
  path: "config/.env/",
});

import app from "./app.js";

mongoDBConnect();
import Razorpay from "razorpay";

app.listen(process.env.PORT, () => {
  console.log(`Server started at ${process.env.PORT}`);
});
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
