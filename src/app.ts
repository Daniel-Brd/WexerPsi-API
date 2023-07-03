import express from "express";
import { config } from "dotenv";
config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.listen(port, () => {
  console.log(`listen on port ${port}`);
});
