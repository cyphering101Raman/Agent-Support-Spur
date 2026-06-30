import { z } from "zod";

export const SenderEnum = z.enum(["user", "ai"]);

export const MessageSchema = z.object({
  id: z.string().uuid().optional(),
  conversationId: z.string().uuid(),
  sender: SenderEnum,
  text: z.string().min(1, "Message text cannot be empty"),
  createdAt: z.date().optional(),
});

export const ConversationSchema = z.object({
  id: z.string().uuid().optional(),
  sessionId: z.string().min(1, "Session ID is required"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  messages: z.array(MessageSchema).optional(),
});

// Request payload schemas for creating resources
export const CreateConversationSchema = ConversationSchema.pick({
  sessionId: true,
});

export const CreateMessageSchema = MessageSchema.pick({
  conversationId: true,
  sender: true,
  text: true,
});

export type MessageType = z.infer<typeof MessageSchema>;
export type ConversationType = z.infer<typeof ConversationSchema>;
export type CreateConversationType = z.infer<typeof CreateConversationSchema>;
export type CreateMessageType = z.infer<typeof CreateMessageSchema>;

const MAX_MESSAGE_LENGTH = process.env.MAX_MESSAGE_LENGTH 
  ? parseInt(process.env.MAX_MESSAGE_LENGTH, 10) 
  : 2000;

export const ChatRequestSchema = z.object({
  message: z.string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(MAX_MESSAGE_LENGTH, "Your message is too long. Please shorten it and try again."),
  sessionId: z.string().optional(),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
