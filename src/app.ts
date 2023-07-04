import express from "express";
import { config } from "dotenv";
config();

import { intializeClient } from "./database/config";
import { router } from "./Routes/routes";
intializeClient();

const app = express();

app.use(express.json());
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`listen on port ${process.env.PORT}`);
});
