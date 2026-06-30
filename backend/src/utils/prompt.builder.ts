import type { Message } from "@prisma/client";
import { STORE_KNOWLEDGE } from "../data/knowledge.js";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Builds the array of messages for the LLM, incorporating the robust
 * knowledge base guardrails and conversational history.
 */
export function buildPrompt(history: Message[], currentMessage: string): ChatMessage[] {
  return [
    { role: "system", content: STORE_KNOWLEDGE },
    ...history.map((msg) => ({
      role: msg.sender === "ai" ? ("assistant" as const) : ("user" as const),
      content: msg.text,
    })),
    { role: "user", content: currentMessage },
  ];
}
