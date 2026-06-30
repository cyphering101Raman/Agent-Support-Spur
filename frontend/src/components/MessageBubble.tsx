import clsx from 'clsx';
import { useState } from 'react';
import type { Message } from '../types/chat';
import SpurLogo from '../assets/Spur-logo.png';
import { User, Copy, Check } from 'lucide-react';

function Avatar({ isUser }: { isUser: boolean }) {
  if (isUser) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 border border-slate-200 self-end mb-1">
        <User className="h-4 w-4" strokeWidth={2.5} />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 overflow-hidden shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200 self-end mb-1">
      <img src={SpurLogo} alt="Spur AI" className="h-full w-full object-cover" />
    </div>
  );
}

function Timestamp({ date, isUser }: { date: Date; isUser: boolean }) {
  return (
    <span className={clsx(
      "text-[11px] block",
      isUser ? "text-blue-100 text-right" : "text-slate-400 text-right"
    )}>
      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  return (
    <div className={clsx(
      "group flex w-full animate-fade-in-up gap-2.5",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && <Avatar isUser={false} />}
      
      <div className={clsx(
        "max-w-[70%] px-4 py-3 rounded-2xl flex flex-col relative",
        isUser 
          ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
          : "bg-slate-100 text-slate-900 border border-slate-200 shadow-sm rounded-bl-sm"
      )}>
        {/* Markdown-ready text container */}
        <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed markdown-content">
          {message.content}
        </div>
        
        <div className={clsx("flex items-end mt-1.5", isUser ? "justify-end" : "justify-between gap-4")}>
          {!isUser && (
            <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center">
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-slate-700 focus:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 -ml-1 flex items-center gap-1 transition-colors"
                aria-label="Copy message"
                title="Copy message"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#22C55E]" strokeWidth={2.5} />
                    <span className="text-[10px] font-medium text-[#22C55E]">Copied</span>
                  </>
                ) : (
                  <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                )}
              </button>
            </div>
          )}
          
          <Timestamp date={new Date(message.timestamp)} isUser={isUser} />
        </div>
      </div>
      
      {isUser && <Avatar isUser={true} />}
    </div>
  );
}
