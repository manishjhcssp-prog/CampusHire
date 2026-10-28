import React from "react";

export function GoogleLogo({ className = "w-5 h-5" }) {
  return (
    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm shrink-0 border border-white/10">
      <svg className={className} viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.44 7.33 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.28 2.56 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
        />
      </svg>
    </div>
  );
}

export function MicrosoftLogo({ className = "w-5 h-5" }) {
  return (
    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm shrink-0 border border-white/10">
      <svg className={className} viewBox="0 0 23 23">
        <rect x="1" y="1" width="9.5" height="9.5" fill="#F25022" rx="0.5" />
        <rect x="12" y="1" width="9.5" height="9.5" fill="#7FBA00" rx="0.5" />
        <rect x="1" y="12" width="9.5" height="9.5" fill="#00A4EF" rx="0.5" />
        <rect x="12" y="12" width="9.5" height="9.5" fill="#FFB900" rx="0.5" />
      </svg>
    </div>
  );
}

export function DeloitteLogo({ className = "w-5 h-5" }) {
  return (
    <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center shadow-sm shrink-0 border border-slate-700">
      <span className="text-white font-black text-sm tracking-tighter">
        D<span className="text-[#86BC25] font-black">.</span>
      </span>
    </div>
  );
}

export function AmazonLogo({ className = "w-5 h-5" }) {
  return (
    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1 shadow-sm shrink-0 border border-white/10">
      <svg className={className} viewBox="0 0 24 24">
        <path
          fill="#111"
          d="M13.9 12.2c-.1-.8-.4-1.4-.9-1.8-.5-.4-1.2-.6-2-.6-.9 0-1.6.3-2.1.8-.5.5-.8 1.1-.9 1.9l5.9-.3zm-6 2.3c.1 1.2.6 2.1 1.4 2.8.8.7 1.8 1 3.1 1 1.2 0 2.2-.3 3-.9.8-.6 1.3-1.4 1.5-2.4l2.8.4c-.4 1.6-1.2 2.8-2.4 3.7-1.2.9-2.8 1.4-4.8 1.4-2.2 0-4-.7-5.3-2.1-1.3-1.4-2-3.3-2-5.7 0-2.4.7-4.3 2-5.7 1.3-1.4 3-2.1 5.2-2.1 2.2 0 3.9.7 5.1 2.1 1.2 1.4 1.8 3.3 1.8 5.7v1.8H7.9z"
        />
        <path
          fill="#FF9900"
          d="M18.8 18.2c2.1-1.4 3.4-3.1 3.7-5-.3.1-.7.2-1.1.2-1.9 0-3.6-.9-4.8-2.3l.8-.8c1 1.2 2.4 1.9 4 1.9.4 0 .7 0 1.1-.1-.1.9-.6 1.8-1.5 2.7l-2.2 3.4z"
        />
      </svg>
    </div>
  );
}

export function CompanyLogoRenderer({ name, className = "w-5 h-5" }) {
  const lower = (name || "").toLowerCase();
  if (lower.includes("google")) return <GoogleLogo className={className} />;
  if (lower.includes("microsoft")) return <MicrosoftLogo className={className} />;
  if (lower.includes("deloitte")) return <DeloitteLogo className={className} />;
  if (lower.includes("amazon")) return <AmazonLogo className={className} />;
  return (
    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-200 border border-slate-700 shrink-0">
      {(name || "C").slice(0, 2).toUpperCase()}
    </div>
  );
}
