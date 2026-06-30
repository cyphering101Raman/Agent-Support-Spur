import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // 1. Always log the actual error for server-side debugging
  console.error("Global Error Handler caught:", err);

  // 2. Handle Zod Validation Errors (if any propagate here)
  if (err.name === "ZodError" || err.issues) {
    res.status(400).json({
      success: false,
      message: "Invalid request data. Please check your inputs.",
    });
    return;
  }

  // 3. Handle Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(500).json({
      success: false,
      message: "Database operation failed. Please try again later."
    });
    return;
  }

  // 4. Handle Groq API Errors
  // Check if it's an API Error from Groq SDK
  if (err.status) {
    if (err.status === 429) {
      res.status(429).json({
        success: false,
        message: "The AI service is currently rate limited. Please try again shortly."
      });
      return;
    }
    if (err.status >= 500) {
      res.status(502).json({
        success: false,
        message: "The AI service is temporarily unavailable. Please try again shortly."
      });
      return;
    }
    // For 401 (Auth) or other 4xx errors, we shouldn't expose details
    res.status(500).json({
      success: false,
      message: "Something went wrong with the AI service. Please try again."
    });
    return;
  }

  // Fallback for custom message errors thrown in code
  if (err.message && err.message.includes("Failed to generate AI reply")) {
    res.status(502).json({
      success: false,
      message: "The AI service is temporarily unavailable. Please try again shortly."
    });
    return;
  }

  // 5. Fallback for all other unknown errors
  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again."
  });
}
