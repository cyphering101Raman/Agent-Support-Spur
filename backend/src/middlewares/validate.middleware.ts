import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate req.body against the provided Zod schema
      const validatedBody = schema.parse(req.body);

      // Overwrite req.body with the sanitized/validated object
      req.body = validatedBody;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: error.issues[0]?.message || "Validation failed",
        });
      }

      // Pass non-Zod errors to the global error handler
      next(error);
    }
  };
}