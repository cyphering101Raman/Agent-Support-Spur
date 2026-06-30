import axios from 'axios';
import type { ChatResponse, ChatHistoryResponse } from '../types/chat';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

export const sendMessage = async (message: string, sessionId?: string | null): Promise<ChatResponse> => {
  const payload: Record<string, string> = { message };
  if (sessionId) {
    payload.sessionId = sessionId;
  }
  const response = await api.post<ChatResponse>('/chat/message', payload);
  return response.data;
};

export const getChatHistory = async (sessionId: string): Promise<ChatHistoryResponse> => {
  const response = await api.get<ChatHistoryResponse>(`/chat/history/${sessionId}`);
  return response.data;
};

export default api;
