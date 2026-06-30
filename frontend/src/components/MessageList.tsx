import { useEffect, useRef } from 'react';
import type { Message } from '../types/chat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmptyState from './EmptyState';
import { AlertTriangle } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  error?: string | null;
  onChipClick: (text: string) => void;
}

export default function MessageList({ messages, loading, error, onChipClick }: MessageListProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (messages.length === 0 && !loading && !error) {
    return <EmptyState onChipClick={onChipClick} />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col space-y-6">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      
      {loading && <TypingIndicator />}
      
      {error && (
        <div className="flex w-full justify-center animate-fade-in-up mt-4">
          <div className="bg-red-50 flex flex-col items-center border border-red-100 p-5 rounded-2xl shadow-sm text-sm text-[#EF4444] max-w-[80%] text-center">
            <AlertTriangle className="h-8 w-8 mb-2 text-[#EF4444]" strokeWidth={2} />
            <span className="font-medium mb-1">Something went wrong</span>
            <span className="opacity-80">Please try again in a moment.</span>
          </div>
        </div>
      )}
      
      <div ref={endOfMessagesRef} />
    </div>
  );
}
