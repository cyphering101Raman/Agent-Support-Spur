import { Groq } from "groq-sdk";
import type { Message } from "@prisma/client";
import { buildPrompt } from "../utils/prompt.builder.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateAIReply(history: Message[], currentMessage: string): Promise<string> {
  const messages = buildPrompt(history, currentMessage);

  const chatCompletion = await groq.chat.completions.create({
    messages: messages as any,
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 1024,
  });

  return chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request.";
}
