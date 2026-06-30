import SpurLogo from '../assets/Spur-logo.png';
import { Package, RotateCcw, CreditCard, Headset } from 'lucide-react';

interface EmptyStateProps {
  onChipClick: (text: string) => void;
}

export default function EmptyState({ onChipClick }: EmptyStateProps) {
  const chips = [
    "Return Policy",
    "Shipping Charges",
    "Track My Order",
    "Refund Process"
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white overflow-y-auto animate-fade-in-up">
      {/* AI Icon/Avatar */}
      <div className="mb-6 flex overflow-hidden h-16 w-16 items-center justify-center rounded-full bg-slate-100 border border-slate-200">
        <img src={SpurLogo} alt="Spur AI" className="h-full w-full object-cover" />
      </div>
      
      <h3 className="mb-2 text-2xl font-semibold text-slate-900">Welcome!</h3>
      <p className="mb-8 max-w-[280px] text-slate-500 leading-relaxed">
        I'm Spur AI.<br />
        I can help answer questions about your orders, shipping, returns and support.
      </p>

      {/* Feature Rows */}
      <div className="mb-10 flex flex-col gap-4 text-left w-full max-w-[200px]">
        <div className="flex items-center gap-4 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <Package className="h-5 w-5 text-blue-500 shrink-0" strokeWidth={2} />
          <span className="font-medium text-sm">Shipping</span>
        </div>
        <div className="flex items-center gap-4 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <RotateCcw className="h-5 w-5 text-blue-500 shrink-0" strokeWidth={2} />
          <span className="font-medium text-sm">Returns</span>
        </div>
        <div className="flex items-center gap-4 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <CreditCard className="h-5 w-5 text-blue-500 shrink-0" strokeWidth={2} />
          <span className="font-medium text-sm">Payments</span>
        </div>
        <div className="flex items-center gap-4 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <Headset className="h-5 w-5 text-blue-500 shrink-0" strokeWidth={2} />
          <span className="font-medium text-sm">Support</span>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap justify-center gap-2 max-w-[320px]">
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onChipClick(chip)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-blue-500 hover:text-blue-500 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
