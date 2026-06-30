import React, { useState, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import ChatHeader from '../components/ChatHeader';
import { Check, MessageSquare } from 'lucide-react';
import SpurHomeLogo from '../assets/spur-home.png';

const ChatPage: React.FC = () => {
  const { messages, input, setInput, loading, error, sendMessage } = useChat();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChatOpen) {
        setIsChatOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatOpen]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-slate-50 p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Subtle radial blue glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      {/* --- Demo Landing Page --- */}
      <div className="max-w-2xl text-center flex flex-col items-center">
        <img src={SpurHomeLogo} alt="Spur Logo" className="h-28 object-contain mb-3" />

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">Spur AI Support Agent</h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6 font-medium">An AI-powered customer support assistant for an e-commerce store.</p>
        <p className="text-base text-gray-500 mb-10 max-w-xl leading-relaxed mx-auto">
          This demo showcases an AI support assistant capable of answering customer questions regarding shipping, refunds, returns, payments, support hours, and general store policies using a real language model.
        </p>

        <div className="flex flex-col gap-3 text-left mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mx-auto w-full max-w-sm">
          {[
            'Shipping Information',
            'Return & Refund Policies',
            'Order Assistance',
            'Store Support',
            'Context-Aware Conversations'
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <Check className="h-5 w-5 text-blue-500 shrink-0" strokeWidth={2.5} />
              <span className="text-slate-700 font-medium">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsChatOpen(true)}
          className="group flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-8 py-4 rounded-full font-medium text-lg shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30"
        >
          <MessageSquare className="h-5 w-5" strokeWidth={2} />
          Launch AI Agent
        </button>
      </div>

      {/* --- Chat Widget Modal --- */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-out ${isChatOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        aria-modal="true"
        role="dialog"
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
          onClick={() => setIsChatOpen(false)}
        />

        {/* Widget Container */}
        <div
          className={`relative flex w-full max-w-[500px] h-[800px] max-h-[90vh] flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl border border-gray-200 transition-all duration-300 ease-out transform ${isChatOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
            }`}
        >
          <ChatHeader onMinimize={() => setIsChatOpen(false)} />

          <MessageList
            messages={messages}
            loading={loading}
            error={error}
            onChipClick={setInput}
          />

          <ChatInput
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
