import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  subText: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  sparklineData?: number[];
}

export default function KPICard({
  label,
  value,
  subText,
  trend,
  icon: Icon,
  iconBg,
  iconColor,
  sparklineData = [30, 40, 35, 50, 49, 60, 70, 91]
}: KPICardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 20px -8px rgba(91, 61, 245, 0.12)' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between h-32 relative overflow-hidden group transition-colors duration-200"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            {label}
          </span>
          <div className="text-2xl font-extrabold text-[#111827] dark:text-white tracking-tight">
            {value}
          </div>
        </div>
        <div className={`p-2 rounded-lg shrink-0 ${iconBg} ${iconColor} transition-all duration-300 group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-end justify-between mt-2">
        <div className="space-y-1">
          {trend ? (
            <div className="flex items-center space-x-1">
              <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
                trend.isPositive 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
              }`}>
                {trend.isPositive ? <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />}
                {trend.value}%
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                {subText}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block leading-none">
              {subText}
            </span>
          )}
        </div>

        {/* Mini sparkline chart using custom SVG */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-16 h-8 opacity-60 group-hover:opacity-100 transition-opacity">
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`gradient-${label.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5B3DF5" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#5B3DF5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d={sparklineData.reduce((path, val, idx) => {
                  const x = (idx / (sparklineData.length - 1)) * 100;
                  const y = 30 - ((val - Math.min(...sparklineData)) / (Math.max(...sparklineData) - Math.min(...sparklineData) || 1)) * 25 - 2;
                  return `${path} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }, '')}
                fill="none"
                stroke="#5B3DF5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`${sparklineData.reduce((path, val, idx) => {
                  const x = (idx / (sparklineData.length - 1)) * 100;
                  const y = 30 - ((val - Math.min(...sparklineData)) / (Math.max(...sparklineData) - Math.min(...sparklineData) || 1)) * 25 - 2;
                  return `${path} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }, '')} L 100 30 L 0 30 Z`}
                fill={`url(#gradient-${label.replace(/\s+/g, '')})`}
              />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}
