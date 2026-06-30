import { Router } from "express";
import { postMessage, getHistory } from "../controllers/chat.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { ChatRequestSchema } from "../models/schema.js";
import { llmRateLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// Apply LLM rate limiter to the message route
router.post("/message", llmRateLimiter, validate(ChatRequestSchema), postMessage);
router.get("/history/:sessionId", getHistory);

export { router as chatRouter };
