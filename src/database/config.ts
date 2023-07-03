import mongoose from "mongoose";

const mongoUrl = process.env.DATABASE_URL as string;

export function intializeClient() {
  mongoose.connection
    .on("close", () => {
      console.log("Connection to Mongo has beem closed");
    })
    .on("error", (err) => {
      console.error("ERROR: Failed to connect to Mongo", err);
    })
    .once("open", () => {
      console.log("Connection to Mongo established successfully.");
    });

  mongoose.connect(mongoUrl);
}

export function closeClient() {
  mongoose.disconnect();
}
