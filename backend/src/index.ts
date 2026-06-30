import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = ["PRISMA_URL", "GROQ_API_KEY"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL ERROR: Missing required environment variable ${envVar}`);
    process.exit(1);
  }
}

import { app } from "./app.js";
import { prisma } from "./db/db.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Verify DB connection
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database is connected");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database or start the server:", error);
    process.exit(1);
  }
}

startServer();
