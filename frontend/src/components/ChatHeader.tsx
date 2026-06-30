import SpurLogo from '../assets/Spur-logo.png';
import { Minus } from 'lucide-react';

interface ChatHeaderProps {
  onMinimize?: () => void;
}

export default function ChatHeader({ onMinimize }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-3">
        {/* AI Avatar */}
        <div className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-full bg-slate-100 border border-slate-200">
          <img src={SpurLogo} alt="Spur AI" className="h-full w-full object-cover" />
        </div>
        
        {/* Title & Subtitle */}
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-slate-900 leading-snug">Spur AI Support</h2>
          <span className="text-sm text-slate-500 leading-snug">Helping customers 24/7</span>
        </div>
      </div>
      
      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Online Indicator */}
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#22C55E]"></span>
          <span className="text-sm font-medium text-slate-500">Online</span>
        </div>
        
        {/* Minimize Button */}
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Minimize chat"
            title="Minimize chat"
          >
            <Minus className="h-5 w-5" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}
