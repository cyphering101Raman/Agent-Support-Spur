import crypto from "crypto";
import { prisma } from "../db/db.js";

/**
 * Resolves a session ID into a Conversation object.
 * - If no sessionId is provided, generates one and creates a new Conversation.
 * - If a sessionId is provided, looks it up.
 * - If found, reuses it.
 * - If not found, creates a new Conversation with that sessionId.
 */
export async function handleSession(sessionId?: string) {
  if (!sessionId) {
    // Generate a new UUID
    const newSessionId = crypto.randomUUID();
    // Create a new Conversation
    const conversation = await prisma.conversation.create({
      data: {
        sessionId: newSessionId,
      },
    });
    return { conversation, sessionId: newSessionId };
  }

  // Lookup the existing conversation
  let conversation = await prisma.conversation.findUnique({
    where: { sessionId },
  });

  // If not found, create it using the provided sessionId
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        sessionId,
      },
    });
  }

  return { conversation, sessionId };
}
