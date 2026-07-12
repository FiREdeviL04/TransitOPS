import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ForbiddenViewProps {
  onBackToDashboard: () => void;
}

export default function ForbiddenView({ onBackToDashboard }: ForbiddenViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-6 animate-scale-up">
      {/* Beautiful Vector style padlock & shield with SVG/Tailwind */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#5B3DF5] rounded-full filter blur-xl opacity-15 animate-pulse w-32 h-32 mx-auto" />
        <div className="relative bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 w-32 h-32 rounded-3xl flex items-center justify-center shadow-lg mx-auto">
          <ShieldAlert className="w-16 h-16 text-[#5B3DF5] animate-bounce" />
          <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white font-[Poppins]">
          403 Access Denied
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
          Terminal Authorization Failed
        </p>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
          Your active workstation profile is bound to the <span className="font-extrabold text-[#5B3DF5]">Driver</span> clearance category. This ERP node is restricted to Admin Command level only.
        </p>
      </div>

      <button
        onClick={onBackToDashboard}
        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Driver Dashboard</span>
      </button>
    </div>
  );
}
