import { config } from "dotenv";
import Razorpay from "razorpay";

config({
  path: "config/.env/",
});

import app from "./app.js";

import { mongoDBConnect } from "./config/database.js";

mongoDBConnect();

// export const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_API_KEY,
//   key_secret: process.env.RAZORPAY_API_SECRET,
// });

app.listen(process.env.PORT, () => {
  console.log(`Server started at ${process.env.PORT}`);
});
