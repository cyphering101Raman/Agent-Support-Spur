import type { Request, Response, NextFunction } from "express";
import { handleSession } from "../services/conversation.service.js";
import { saveUserMessage, saveAIMessage, getConversationHistory } from "../services/message.service.js";
import { generateAIReply } from "../services/llm.service.js";
import type { ChatRequest } from "../models/schema.js";
import { getCachedData, setCachedData, deleteCachedData } from "../services/cache.service.js";
import { cacheKeys } from "../utils/cacheKeys.js";

export async function postMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // req.body is already typed and validated by the middleware
    const { sessionId, message } = req.body as ChatRequest;

    // 1. Resolve or Create the Conversation Session
    const sessionResult = await handleSession(sessionId);
    const conversationId = sessionResult.conversation.id;

    // 2. Fetch Conversation History (before saving current message so history is strictly past)
    const history = await getConversationHistory(conversationId);

    // 3. Persist the User Message
    const userMessage = await saveUserMessage(conversationId, message);

    // 4. Generate AI Reply
    const aiReplyText = await generateAIReply(history, message);

    // 5. Persist the AI Message
    const aiMessage = await saveAIMessage(conversationId, aiReplyText);

    // 6. Update Cache (Write-Through)
    try {
      const cacheKey = cacheKeys.chatHistory(sessionResult.sessionId);
      // Try to get the existing cache
      const cachedMessages = await getCachedData<any[]>(cacheKey);
      
      // Only update if cache exists, otherwise let the next GET request reconstruct it
      if (cachedMessages) {
        cachedMessages.push(
          {
            id: userMessage.id,
            role: 'user',
            content: userMessage.text,
            timestamp: userMessage.createdAt.toISOString()
          },
          {
            id: aiMessage.id,
            role: 'assistant',
            content: aiMessage.text,
            timestamp: aiMessage.createdAt.toISOString()
          }
        );
        // Save the updated cache back to Redis with 1 hour TTL
        await setCachedData(cacheKey, cachedMessages, 3600);
      }
    } catch (cacheError) {
      console.error("Failed to update cache via write-through, falling back to cache deletion:", cacheError);
      // Fallback: attempt to delete so it reconstructs cleanly next time, catch and ignore if delete fails too
      await deleteCachedData(cacheKeys.chatHistory(sessionResult.sessionId)).catch(() => {});
    }

    // 7. Return response
    res.status(200).json({
      reply: aiReplyText,
      sessionId: sessionResult.sessionId
    });
  } catch (error) {
    // Forward the error to the global error handler middleware
    next(error);
  }
}

export async function getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      res.status(400).json({ error: "sessionId is required" });
      return;
    }

    // 1. Check Redis Cache
    const cacheKey = cacheKeys.chatHistory(sessionId as string);
    const cachedMessages = await getCachedData(cacheKey);
    if (cachedMessages) {
      res.status(200).json({ messages: cachedMessages });
      return;
    }

    const sessionResult = await handleSession(sessionId as string);
    const conversationId = sessionResult.conversation.id;
    const history = await getConversationHistory(conversationId);

    const messages = history.map(msg => ({
      id: msg.id,
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
      timestamp: msg.createdAt.toISOString()
    }));

    // 2. Set Redis Cache (TTL: 1 hour = 3600 seconds)
    await setCachedData(cacheKey, messages, 3600);

    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
}
