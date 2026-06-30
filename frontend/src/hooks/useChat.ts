import { useState, useEffect } from 'react';
import type { Message } from '../types/chat';
import { sendMessage, getChatHistory } from '../api/chat';
import { getSessionId, setSessionId } from '../services/session';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initSession = async () => {
      const sessionId = getSessionId();
      if (sessionId) {
        setLoading(true);
        try {
          const history = await getChatHistory(sessionId);
          setMessages(history.messages);
        } catch (err: any) {
          setError(err.response?.data?.error || err.message || 'Failed to load history');
        } finally {
          setLoading(false);
        }
      }
    };
    initSession();
  }, []);

  const sendMessageFn = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const sessionId = getSessionId();
      const response = await sendMessage(userMessage.content, sessionId);
      
      if (response.sessionId && response.sessionId !== sessionId) {
        setSessionId(response.sessionId);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return { messages, input, setInput, loading, error, sendMessage: sendMessageFn };
}
