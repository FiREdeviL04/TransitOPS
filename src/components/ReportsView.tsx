import React from 'react';
import { TrendingUp, FileSpreadsheet, FileText, Download, ShieldCheck, HelpCircle } from 'lucide-react';
import { Driver, FuelLog, MaintenanceRecord } from '../types';

interface ReportsViewProps {
  drivers: Driver[];
  fuelLogs: FuelLog[];
  maintenance: MaintenanceRecord[];
  totalFleetHealth: number;
  handleExport: (format: 'CSV' | 'PDF') => void;
}

export default function ReportsView({
  drivers,
  fuelLogs,
  maintenance,
  totalFleetHealth,
  handleExport
}: ReportsViewProps) {
  
  const avgSafetyScore = Math.round(drivers.reduce((s, d) => s + d.safetyScore, 0) / (drivers.length || 1));
  const resolvedMaintenanceCount = maintenance.filter(m => m.status === 'Resolved').length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner Control Board */}
      <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Enterprise Auditing Console</h3>
          <p className="text-[10px] text-slate-500">Generate on-demand compliance sheets, vehicle gas usage matrices, and operator performance indexes</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleExport('CSV')} 
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Spreadsheet .CSV</span>
          </button>
          <button 
            onClick={() => handleExport('PDF')} 
            className="px-3.5 py-2 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 shadow-md shadow-[#5B3DF5]/15 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Compliance .PDF</span>
          </button>
        </div>
      </div>

      {/* Dynamic reporting summary matrices */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block">Fleet Health Index</span>
          <div className="text-2xl font-extrabold text-[#111827] dark:text-white">{totalFleetHealth}%</div>
          <span className="text-[9px] text-green-500 font-bold flex items-center uppercase">
            <TrendingUp className="w-3 h-3 mr-0.5" /> Over target limit
          </span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block">Operator Safety rating</span>
          <div className="text-2xl font-extrabold text-[#111827] dark:text-white">{avgSafetyScore}/100</div>
          <span className="text-[9px] text-green-500 font-bold flex items-center uppercase">● High safety ranking</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block">Fuel vouchers MTD</span>
          <div className="text-2xl font-extrabold text-[#111827] dark:text-white">{fuelLogs.length} Receipts</div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Active telemetry entries</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block">Resolved maintenance</span>
          <div className="text-2xl font-extrabold text-[#111827] dark:text-white">{resolvedMaintenanceCount} Issues</div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Resolved repair tasks</span>
        </div>
      </div>

      {/* Available System Reports */}
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 space-y-4 transition-colors">
        <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Available Compliance Templates</h4>
        
        {[
          { name: 'Weekly Fuel Efficiency Analytics Matrix', code: 'TO-REP-021', desc: 'Detailed heavy-transits fuel efficiency MPG records, standby idle telemetry, and associated station voucher audits' },
          { name: 'Driver Safety Score Compliance Ledger', code: 'TO-REP-055', desc: 'CDL hours-on-duty logs, automated safety threshold ratings, and active speeding incident alerts' },
          { name: 'Fleet Asset Utilization and Decommission Report', code: 'TO-REP-019', desc: 'Standby terminal load capacities, vehicle utilization rates, and active depot terminal distributions' },
          { name: 'Consolidated General Operating Overhead Invoices', code: 'TO-REP-102', desc: 'Unified business expense records for tax accounting audits, fuel spending, and depot repair tickets' },
        ].map((rep, rIdx) => (
          <div key={rIdx} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg transition-colors group">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[9px] font-extrabold text-[#5B3DF5] bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">{rep.code}</span>
                <h5 className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-[#5B3DF5] transition-colors">{rep.name}</h5>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{rep.desc}</p>
            </div>
            <button 
              onClick={() => handleExport('PDF')}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:border-[#5B3DF5] text-slate-500 hover:text-[#5B3DF5] rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center space-x-1"
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
