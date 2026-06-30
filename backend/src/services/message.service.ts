import { createMessage, getMessagesByConversationId } from "../repositories/message.repository.js";
import { Sender } from "@prisma/client";

export async function saveUserMessage(conversationId: string, text: string) {
  return createMessage(conversationId, Sender.user, text);
}

export async function saveAIMessage(conversationId: string, text: string) {
  return createMessage(conversationId, Sender.ai, text);
}

export async function getConversationHistory(conversationId: string) {
  return getMessagesByConversationId(conversationId);
}
