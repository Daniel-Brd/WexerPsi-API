import express from "express";
import { config } from "dotenv";
import path from "path";
config();

import { intializeClient } from "./database/config";
import { router } from "./routes/routes";

intializeClient();

const app = express();

app.use(express.json());
app.use(router);
app.use(express.static(path.resolve(__dirname, "..", "uploads")));

app.listen(process.env.PORT, () => {
  console.log(`listen on port ${process.env.PORT}`);
});
