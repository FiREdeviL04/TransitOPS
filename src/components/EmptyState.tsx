import React from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  type: 'vehicles' | 'drivers' | 'trips' | 'fuel' | 'expenses' | 'maintenance' | 'reports' | 'generic';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  // Return different modern SVG illustrations based on the empty state type
  const renderIllustration = () => {
    switch (type) {
      case 'vehicles':
        return (
          <svg className="w-48 h-36 text-[#5B3DF5] opacity-80" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="75" r="50" fill="#5B3DF5" fillOpacity="0.05" />
            <path d="M40 90H160L145 60H55L40 90Z" fill="#7C5CFC" fillOpacity="0.1" stroke="#5B3DF5" strokeWidth="2" strokeLinejoin="round" />
            <rect x="65" y="45" width="70" height="25" rx="4" fill="white" stroke="#5B3DF5" strokeWidth="2" />
            <circle cx="65" cy="100" r="12" fill="#111827" stroke="#5B3DF5" strokeWidth="2" />
            <circle cx="65" cy="100" r="4" fill="white" />
            <circle cx="135" cy="100" r="12" fill="#111827" stroke="#5B3DF5" strokeWidth="2" />
            <circle cx="135" cy="100" r="4" fill="white" />
            <line x1="85" y1="60" x2="115" y2="60" stroke="#5B3DF5" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'drivers':
        return (
          <svg className="w-48 h-36 text-[#5B3DF5] opacity-80" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="75" r="50" fill="#22C55E" fillOpacity="0.05" />
            <path d="M70 120C70 95 83 80 100 80C117 80 130 95 130 120" fill="#22C55E" fillOpacity="0.1" stroke="#22C55E" strokeWidth="2" />
            <circle cx="100" cy="55" r="18" fill="white" stroke="#22C55E" strokeWidth="2" />
            <circle cx="95" cy="52" r="2" fill="#22C55E" />
            <circle cx="105" cy="52" r="2" fill="#22C55E" />
            <path d="M96 62C98 64 102 64 104 62" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="125" y="40" width="30" height="40" rx="3" fill="white" stroke="#38BDF8" strokeWidth="2" transform="rotate(15 140 60)" />
            <line x1="132" y1="50" x2="148" y2="54" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="130" y1="58" x2="146" y2="62" stroke="#38BDF8" strokeWidth="1.5" />
          </svg>
        );
      case 'trips':
        return (
          <svg className="w-48 h-36 text-[#38BDF8] opacity-80" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="75" r="50" fill="#38BDF8" fillOpacity="0.05" />
            <path d="M50 75C50 75 75 40 100 40C125 40 150 75 150 75C150 75 125 110 100 110C75 110 50 75 50 75Z" fill="#38BDF8" fillOpacity="0.1" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="100" cy="75" r="15" fill="white" stroke="#5B3DF5" strokeWidth="2" />
            <path d="M92 75H108M100 67V83" stroke="#5B3DF5" strokeWidth="2" strokeLinecap="round" />
            <path d="M60 115L80 125" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
            <path d="M120 125L140 115" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'maintenance':
        return (
          <svg className="w-48 h-36 text-[#F59E0B] opacity-80" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="75" r="50" fill="#F59E0B" fillOpacity="0.05" />
            <path d="M130 50L115 65C110 60 105 55 100 50L115 35C120 40 125 45 130 50Z" fill="#F59E0B" fillOpacity="0.1" stroke="#F59E0B" strokeWidth="2" />
            <path d="M70 110L105 75" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
            <rect x="58" y="102" width="16" height="16" rx="2" fill="white" stroke="#F59E0B" strokeWidth="2" transform="rotate(45 66 110)" />
            <circle cx="120" cy="45" r="6" fill="white" stroke="#F59E0B" strokeWidth="2" />
          </svg>
        );
      default:
        return (
          <svg className="w-48 h-36 text-[#6B7280] opacity-60" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="75" r="45" fill="#E5E7EB" fillOpacity="0.3" />
            <rect x="75" y="50" width="50" height="50" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="2" />
            <line x1="85" y1="65" x2="115" y2="65" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
            <line x1="85" y1="75" x2="105" y2="75" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
            <line x1="85" y1="85" x2="110" y2="85" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#1E293B] border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-4 shadow-xs"
    >
      <div className="flex justify-center items-center h-36">
        {renderIllustration()}
      </div>
      <div className="max-w-md space-y-1.5">
        <h4 className="text-sm font-bold text-[#111827] dark:text-white uppercase tracking-wider">
          {title}
        </h4>
        <p className="text-xs text-[#6B7280] dark:text-slate-400">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white text-xs font-bold rounded-lg shadow-md shadow-[#5B3DF5]/15 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  );
}
