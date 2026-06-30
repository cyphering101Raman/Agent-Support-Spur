import express from "express";
import cors from "cors";
import { chatRouter } from "./routes/chat.routes.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/chat", chatRouter);

// Basic test route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is up and running." });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Global Error Handler must be the last middleware
app.use(globalErrorHandler);

export { app };
