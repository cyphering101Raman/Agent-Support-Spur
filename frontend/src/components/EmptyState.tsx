import SpurLogo from '../assets/Spur-logo.png';
import { Package, RotateCcw, CreditCard, Headset } from 'lucide-react';

interface EmptyStateProps {
  onChipClick: (text: string) => void;
}

export default function EmptyState({ onChipClick }: EmptyStateProps) {

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white overflow-hidden animate-fade-in-up">
      {/* AI Icon/Avatar */}
      <div className="mb-6 mt-10 flex shrink-0 overflow-hidden h-16 w-16 items-center justify-center rounded-full bg-slate-100 border border-slate-200">
        <img src={SpurLogo} alt="Spur AI" className="h-full w-full object-cover" />
      </div>

      <h3 className="mb-2 text-2xl font-semibold text-slate-900">Welcome!</h3>
      <p className="mb-8 max-w-[280px] text-slate-500 leading-relaxed">
        I'm Spur AI.<br />
        I can help answer questions about your orders, shipping, returns and support.
      </p>

      {/* Feature Rows */}
      <div className="mb-10 grid grid-cols-2 gap-3 text-left w-full max-w-[320px]">
        <button onClick={() => onChipClick("Shipping")} className="flex items-center gap-4 text-blue-900 bg-blue-50 p-3 rounded-xl border border-blue-100 transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-left">
          <Package className="h-5 w-5 text-blue-500 shrink-0" strokeWidth={2} />
          <span className="font-medium text-sm">Shipping</span>
        </button>
        <button onClick={() => onChipClick("Returns")} className="flex items-center gap-4 text-blue-900 bg-blue-50 p-3 rounded-xl border border-blue-100 transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-left">
          <RotateCcw className="h-5 w-5 text-blue-500 shrink-0" strokeWidth={2} />
          <span className="font-medium text-sm">Returns</span>
        </button>
        <button onClick={() => onChipClick("Payments")} className="flex items-center gap-4 text-blue-900 bg-blue-50 p-3 rounded-xl border border-blue-100 transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-left">
          <CreditCard className="h-5 w-5 text-blue-500 shrink-0" strokeWidth={2} />
          <span className="font-medium text-sm">Payments</span>
        </button>
        <button onClick={() => onChipClick("Support")} className="flex items-center gap-4 text-blue-900 bg-blue-50 p-3 rounded-xl border border-blue-100 transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-left">
          <Headset className="h-5 w-5 text-blue-500 shrink-0" strokeWidth={2} />
          <span className="font-medium text-sm">Support</span>
        </button>
      </div>
    </div>
  );
}
