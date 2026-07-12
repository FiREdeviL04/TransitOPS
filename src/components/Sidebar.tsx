import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Truck, Users, MapPin, Wrench, Fuel, CreditCard, 
  BarChart3, Settings, User, LogOut, ChevronDown, ChevronRight, Activity, Terminal, Lock 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  vehiclesCount: number;
  driversCount: number;
  tripsCount: number;
  maintenanceCount: number;
}

export default function Sidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  activeTab,
  setActiveTab,
  onLogout,
  vehiclesCount,
  driversCount,
  tripsCount,
  maintenanceCount
}: SidebarProps) {
  const { user, logout } = useAuth();
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState('Central Terminal');

  const workspaces = [
    'Central Terminal',
    'West Logistic Depot',
    'East Heavy Transit',
    'Southern Fleet Hub'
  ];

  const menuItems = user?.role === 'Admin'
    ? [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'vehicles', label: 'Fleet Vehicles', icon: Truck, count: vehiclesCount },
        { id: 'drivers', label: 'Drivers Roster', icon: Users, count: driversCount },
        { id: 'trips', label: 'Route Dispatches', icon: MapPin, count: tripsCount },
        { id: 'maintenance', label: 'Maintenance Hub', icon: Wrench, count: maintenanceCount, badgeColor: 'bg-amber-500' },
        { id: 'fuel', label: 'Fuel Telemetry', icon: Fuel },
        { id: 'expenses', label: 'Operating Expenses', icon: CreditCard },
        { id: 'reports', label: 'Reporting Console', icon: BarChart3 },
        { id: 'settings', label: 'ERP Settings', icon: Settings },
        { id: 'profile', label: 'Terminal Profile', icon: User },
      ]
    : [
        { id: 'dashboard', label: 'Driver Dashboard', icon: LayoutDashboard },
        { id: 'trips', label: 'My Trips', icon: MapPin, count: tripsCount },
        { id: 'vehicles', label: 'My Vehicle', icon: Truck },
        { id: 'fuel', label: 'Fuel Logs', icon: Fuel },
        { id: 'profile', label: 'My Profile', icon: User },
        // Restricted tabs for Driver to click and see 403
        { id: 'drivers', label: 'Drivers Roster', icon: Users, isLocked: true },
        { id: 'maintenance', label: 'Maintenance Hub', icon: Wrench, isLocked: true },
        { id: 'expenses', label: 'Operating Expenses', icon: CreditCard, isLocked: true },
        { id: 'reports', label: 'Reporting Console', icon: BarChart3, isLocked: true },
        { id: 'settings', label: 'ERP Settings', icon: Settings, isLocked: true },
      ];

  return (
    <aside className={`bg-[#111827] text-slate-300 flex flex-col shrink-0 transition-all duration-300 border-r border-slate-800 relative z-20 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
      
      {/* Brand & Logo Section */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3 overflow-hidden">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-2 bg-[#5B3DF5] rounded-xl shrink-0 shadow-lg shadow-[#5B3DF5]/30"
          >
            <Truck className="w-5 h-5 text-white" />
          </motion.div>
          {!sidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="leading-none"
            >
              <span className="font-bold text-lg text-white tracking-tight font-[Poppins]">TransitOps</span>
              <span className="block text-[8px] tracking-widest text-[#38BDF8] font-bold uppercase mt-0.5">SaaS Platform</span>
            </motion.div>
          )}
        </div>
        
        {/* Modern collapse button */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 hover:text-white transition-colors text-slate-400 hidden md:flex items-center justify-center cursor-pointer"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 transform rotate-90" />}
        </button>
      </div>

      {/* Workspace Switcher */}
      {!sidebarCollapsed && (
        <div className="px-4 py-3 border-b border-slate-800/60 relative">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">WORKSPACE</span>
          <button 
            onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            className="w-full flex items-center justify-between p-2 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-2 truncate">
              <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="truncate">{currentWorkspace}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showWorkspaceDropdown ? 'transform rotate-180' : ''}`} />
          </button>

          {/* Workspace dropdown popover */}
          <AnimatePresence>
            {showWorkspaceDropdown && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowWorkspaceDropdown(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-4 right-4 mt-1 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-40 overflow-hidden py-1"
                >
                  {workspaces.map(ws => (
                    <button
                      key={ws}
                      onClick={() => {
                        setCurrentWorkspace(ws);
                        setShowWorkspaceDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-[#5B3DF5] hover:text-white transition-colors block text-slate-300"
                    >
                      {ws}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map(item => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 relative group cursor-pointer ${
                isActive 
                  ? 'bg-[#5B3DF5] text-white shadow-md shadow-[#5B3DF5]/20' 
                  : 'hover:bg-slate-800/40 hover:text-white text-slate-400'
              }`}
              title={item.label}
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <IconComponent className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:scale-110'
                }`} />
                {!sidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="truncate flex items-center space-x-1.5"
                  >
                    <span>{item.label}</span>
                    {item.isLocked && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
                  </motion.span>
                )}
              </div>
              
              {!sidebarCollapsed && item.count !== undefined && item.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-400'
                }`}>
                  {item.count}
                </span>
              )}

              {!sidebarCollapsed && item.isLocked && (
                <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded leading-none shrink-0">
                  403
                </span>
              )}

              {/* Active Indicator bar */}
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute left-0 top-2 bottom-2 w-1 bg-[#38BDF8] rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Workspace system specs version card */}
      {!sidebarCollapsed && (
        <div className="px-4 py-3 m-3 bg-slate-900/60 border border-slate-800/40 rounded-xl space-y-1.5 text-center">
          <div className="flex items-center justify-center space-x-1 text-[9px] text-slate-500 font-bold tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-[#5B3DF5]" />
            <span>TERMINAL CONSOLE</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Node: <span className="text-emerald-400 font-semibold">Active OK</span>
          </div>
          <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
            v4.2.1-Prod
          </div>
        </div>
      )}

      {/* User Card Profile Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B3DF5] to-[#7C5CFC] text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase shadow-md shadow-[#5B3DF5]/15">
            {user ? user.name.split(' ').map((n: string) => n[0]).join('') : 'JD'}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-hidden leading-tight">
              <p className="text-xs font-bold text-white truncate">{user ? user.name : 'James Donovan'}</p>
              <p className="text-[9px] text-slate-500 font-semibold truncate uppercase tracking-wider">
                {user?.role === 'Admin' ? 'Fleet Director' : 'Active Duty Driver'}
              </p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button 
              onClick={onLogout}
              className="text-slate-500 hover:text-[#EF4444] hover:bg-slate-800 p-1.5 rounded-lg transition-all cursor-pointer" 
              title="Sign Out Workstation"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
