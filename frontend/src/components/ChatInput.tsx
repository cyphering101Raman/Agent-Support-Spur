import { type KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  loading: boolean;
}

export default function ChatInput({ input, setInput, onSend, loading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CHARS = 2000;
  const isTooLong = input.length > MAX_CHARS;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isTooLong && input.trim() && !loading) {
        onSend();
      }
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white border-t border-slate-200 gap-2 rounded-b-[24px]">
      <div className="flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          className="flex-1 border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none min-h-[44px] transition-colors overflow-y-auto scrollbar-hide shadow-sm"
          placeholder="Ask anything about orders, shipping or returns..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className="flex h-[44px] w-[44px] items-center justify-center bg-[#2563EB] text-white rounded-full hover:bg-[#1D4ED8] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onSend}
          disabled={loading || !input.trim() || isTooLong}
          aria-label="Send message"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5 -ml-0.5" strokeWidth={2} />
          )}
        </button>
      </div>
      {isTooLong && (
        <span className="text-red-500 text-sm font-medium px-2">
          Message is too long to send. ({input.length}/{MAX_CHARS})
        </span>
      )}
    </div>
  );
}
