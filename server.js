import { config } from "dotenv";

config({
  path: "config/.env/",
});

import app from "./app.js";

import { mongoDBConnect } from "./config/database.js";

mongoDBConnect();

app.listen(process.env.PORT, () => {
  console.log(`Server started at ${process.env.PORT}`);
});
