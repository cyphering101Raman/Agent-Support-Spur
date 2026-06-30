import SpurLogo from "../assets/Spur-logo.png";

export default function TypingIndicator() {
  return (
    <div className="flex w-full animate-fade-in-up gap-2.5 justify-start">
      <div className="flex h-8 w-8 overflow-hidden shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200 self-end mb-1">
        <img src={SpurLogo} alt="Spur AI" className="h-full w-full object-cover" />
      </div>

      <div className="px-4 py-2.5 rounded-2xl flex items-center bg-slate-100 border border-slate-200 shadow-sm rounded-bl-sm">
        <div className="flex items-center text-[13px] font-normal text-slate-500">
          <span className="animate-ellipsis">Agent is typing</span>
        </div>
      </div>
    </div>
  );
}