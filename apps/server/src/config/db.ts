import mongoose from "mongoose";
import { env } from "./env";

export async function connectDatabase(): Promise<void> {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("[db] connected to MongoDB");
  } catch (err) {
    if (env.nodeEnv === "production") throw err;
    console.warn("[db] could not connect to MongoDB — continuing in degraded dev mode:", (err as Error).message);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
