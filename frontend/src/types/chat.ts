export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
}

export interface ChatHistoryResponse {
  messages: Message[];
}
