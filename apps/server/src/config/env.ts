function required(name: string, fallbackForDev?: string): string {
  const v = process.env[name];
  if (v) return v;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`Missing required env var: ${name}`);
  }
  if (fallbackForDev !== undefined) return fallbackForDev;
  throw new Error(`Missing required env var: ${name}`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/portify-ai",
  jwtSecret: required("JWT_SECRET", "dev-insecure-access-secret"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET", "dev-insecure-refresh-secret"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  aiApiKey: process.env.AI_API_KEY,
  aiProvider: process.env.AI_API_KEY ? ("openai" as const) : ("mock" as const),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};
