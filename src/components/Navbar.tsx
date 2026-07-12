import React from 'react';
import { Search, Bell, Menu, Plus, Calendar, Moon, Sun, Command } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenCommandPalette: () => void;
  theme: 'Light' | 'Dark';
  onToggleTheme: () => void;
  onOpenDispatchModal: () => void;
  onSimulateGps: () => void;
  isSimulatingGps: boolean;
}

export default function Navbar({
  activeTab,
  globalSearch,
  setGlobalSearch,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenCommandPalette,
  theme,
  onToggleTheme,
  onOpenDispatchModal,
  onSimulateGps,
  isSimulatingGps
}: NavbarProps) {
  
  // Format current date
  const formatCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Executive Overview';
      case 'vehicles':
        return 'Fleet Inventory';
      case 'drivers':
        return 'Operators Roster';
      case 'trips':
        return 'Freight Dispatches';
      case 'maintenance':
        return 'Service Repair Tickets';
      case 'fuel':
        return 'Fuel Logs & Telemetry';
      case 'expenses':
        return 'General Ledgers';
      case 'reports':
        return 'Analytic Reports';
      case 'settings':
        return 'ERP Configurations';
      case 'profile':
        return 'Operator Terminal Profile';
      default:
        return 'Workstation Overview';
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-[#1E293B] border-b border-slate-150 dark:border-slate-800/80 flex items-center justify-between px-6 shrink-0 shadow-xs z-10 transition-colors duration-200">
      
      {/* Left side Breadcrumbs layout */}
      <div className="flex items-center space-x-3 text-xs">
        <span className="font-bold text-[#5B3DF5] uppercase tracking-wider font-[Poppins]">TransitOps</span>
        <span className="text-slate-300 dark:text-slate-600 font-light">/</span>
        <span className="text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">
          {activeTab}
        </span>
        <span className="text-slate-300 dark:text-slate-600 font-light">/</span>
        <h2 className="font-extrabold text-[#111827] dark:text-white uppercase tracking-wide">
          {getBreadcrumbTitle()}
        </h2>
      </div>

      {/* Right side functional items */}
      <div className="flex items-center space-x-4">
        
        {/* Calendar current date display */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 rounded-lg text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatCurrentDate()}</span>
        </div>

        {/* Real-time Dynamic GPS Sim Trigger button */}
        <button
          onClick={onSimulateGps}
          disabled={isSimulatingGps}
          className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-900/10 text-[#5B3DF5] text-[11px] font-bold uppercase cursor-pointer transition-all ${
            isSimulatingGps ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Simulate vehicle positions and fuel consumption telemetries"
        >
          <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${isSimulatingGps ? 'animate-ping' : ''}`} />
          <span>Live Telemetry Sim</span>
        </button>

        {/* Global Search text input */}
        <div className="relative hidden md:block">
          <input
            type="text"
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            placeholder="Filter active workspace grid..."
            className="w-48 pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900/30 border border-slate-150 dark:border-slate-800/60 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#5B3DF5] text-[#111827] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:w-56"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
        </div>

        {/* CTRL+K Palette shortcut indicator */}
        <button
          onClick={onOpenCommandPalette}
          className="p-2 text-slate-400 hover:text-[#5B3DF5] hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
          title="Open Command Console (Ctrl+K)"
        >
          <Command className="w-4 h-4" />
          <span className="hidden sm:inline text-[9px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-850 px-1 py-0.5 rounded text-slate-400">
            Ctrl+K
          </span>
        </button>

        {/* Theme toggle Button switcher */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
          title="Switch layout theme"
        >
          {theme === 'Light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Operations Logs trigger with Badge */}
        <button
          onClick={onOpenNotifications}
          className="p-2 text-slate-400 hover:text-[#5B3DF5] hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg relative transition-colors cursor-pointer"
          title="Operations log feeds"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444]" />
          )}
        </button>

        {/* Primary quick dispatch trip CTA */}
        <button
          onClick={onOpenDispatchModal}
          className="px-3 py-1.5 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white rounded-lg text-[11px] font-bold uppercase flex items-center space-x-1 shadow-md shadow-[#5B3DF5]/20 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dispatch trip</span>
        </button>

      </div>
    </header>
  );
}
