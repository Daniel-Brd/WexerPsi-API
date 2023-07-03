import mongoose from "mongoose";

const url = process.env.DATABASE_URL as string;

export function connectDatabase() {
  mongoose.connection
    .on("open", () => {
      console.log("Connection to Mongo established.");
    })
    .on("close", () => {
      console.log("Connection to Mongo closed.");
    })
    .on("error", (err) => {
      console.log("ERROR: Failed to establish connection with Mongo", err);
    });
  mongoose.connect(url);
}

export function disconnectDatabase() {
  mongoose.disconnect();
}
