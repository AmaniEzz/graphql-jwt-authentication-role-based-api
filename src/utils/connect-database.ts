import mongoose from "mongoose";
import config from "config";

export async function connectToMongo() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(config.get("dbUri"));
    console.log("🚀 Database connected successfully");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
