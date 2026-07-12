import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Truck, Users, MapPin, Wrench, Fuel, CreditCard, BarChart3, Settings, ShieldAlert, Plus, Command } from 'lucide-react';
import { Vehicle, Driver, Trip } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  onNavigate: (tabId: string) => void;
  onTriggerAction: (actionType: 'vehicle' | 'driver' | 'trip' | 'maintenance' | 'fuel' | 'expense') => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  vehicles,
  drivers,
  trips,
  onNavigate,
  onTriggerAction
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle palette with CTRL+K or CMD+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Items definition
  const staticCommands = [
    { id: 'nav-dashboard', label: 'Go to Dashboard Overview', category: 'Navigation', icon: Command, action: () => onNavigate('dashboard') },
    { id: 'nav-vehicles', label: 'Go to Vehicles Roster', category: 'Navigation', icon: Truck, action: () => onNavigate('vehicles') },
    { id: 'nav-drivers', label: 'Go to Drivers Roster', category: 'Navigation', icon: Users, action: () => onNavigate('drivers') },
    { id: 'nav-trips', label: 'Go to Trips Dispatcher', category: 'Navigation', icon: MapPin, action: () => onNavigate('trips') },
    { id: 'nav-maintenance', label: 'Go to Maintenance Tickets', category: 'Navigation', icon: Wrench, action: () => onNavigate('maintenance') },
    { id: 'nav-fuel', label: 'Go to Fuel Telemetry Logs', category: 'Navigation', icon: Fuel, action: () => onNavigate('fuel') },
    { id: 'nav-expenses', label: 'Go to Expenses General Ledger', category: 'Navigation', icon: CreditCard, action: () => onNavigate('expenses') },
    { id: 'nav-reports', label: 'Go to Reports Console', category: 'Navigation', icon: BarChart3, action: () => onNavigate('reports') },
    { id: 'nav-settings', label: 'Go to ERP Settings', category: 'Navigation', icon: Settings, action: () => onNavigate('settings') },

    { id: 'act-vehicle', label: 'Register New Fleet Vehicle', category: 'Quick Actions', icon: Plus, action: () => onTriggerAction('vehicle') },
    { id: 'act-driver', label: 'Onboard New Driver Operator', category: 'Quick Actions', icon: Plus, action: () => onTriggerAction('driver') },
    { id: 'act-trip', label: 'Dispatch New Freight Trip', category: 'Quick Actions', icon: Plus, action: () => onTriggerAction('trip') },
    { id: 'act-maint', label: 'Issue New Maintenance Ticket', category: 'Quick Actions', icon: Plus, action: () => onTriggerAction('maintenance') },
    { id: 'act-fuel', label: 'Record New Fuel Refill Log', category: 'Quick Actions', icon: Plus, action: () => onTriggerAction('fuel') },
    { id: 'act-expense', label: 'Log New Expense Voucher', category: 'Quick Actions', icon: Plus, action: () => onTriggerAction('expense') },
  ];

  const filteredVehicles = vehicles
    .filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.plate.toLowerCase().includes(search.toLowerCase()))
    .map(v => ({
      id: `v-${v.id}`,
      label: `Vehicle: ${v.name} (${v.plate}) [${v.status}]`,
      category: 'Vehicles',
      icon: Truck,
      action: () => {
        onNavigate('vehicles');
        onClose();
      }
    }));

  const filteredDrivers = drivers
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.license.toLowerCase().includes(search.toLowerCase()))
    .map(d => ({
      id: `d-${d.id}`,
      label: `Driver: ${d.name} (License: ${d.license}) [Status: ${d.status}]`,
      category: 'Drivers',
      icon: Users,
      action: () => {
        onNavigate('drivers');
        onClose();
      }
    }));

  const filteredTrips = trips
    .filter(t => t.id.toLowerCase().includes(search.toLowerCase()) || t.destination.toLowerCase().includes(search.toLowerCase()))
    .map(t => ({
      id: `t-${t.id}`,
      label: `Trip ${t.id} to ${t.destination} [${t.status}]`,
      category: 'Trips',
      icon: MapPin,
      action: () => {
        onNavigate('trips');
        onClose();
      }
    }));

  // Combine results
  const allResults = [
    ...staticCommands.filter(c => c.label.toLowerCase().includes(search.toLowerCase())),
    ...filteredVehicles,
    ...filteredDrivers,
    ...filteredTrips
  ];

  // Navigate selection with keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % allResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allResults.length) % allResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        allResults[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2 }}
            ref={containerRef}
            className="w-full max-w-xl bg-white dark:bg-[#1E293B] border border-slate-150 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden text-xs"
          >
            {/* Search Input bar */}
            <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800 space-x-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search vehicles, drivers, commands (e.g. 'Register Vehicle')..."
                className="w-full bg-transparent focus:outline-none text-[#111827] dark:text-white placeholder-slate-400 font-medium text-xs border-0 py-0"
              />
              <div className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 dark:text-slate-500 rounded font-mono font-bold shrink-0">
                ESC
              </div>
            </div>

            {/* Results listing */}
            <div className="max-h-72 overflow-y-auto py-2">
              {allResults.length > 0 ? (
                <div>
                  {/* Group items by category */}
                  {['Navigation', 'Quick Actions', 'Vehicles', 'Drivers', 'Trips'].map(category => {
                    const categoryItems = allResults.filter(item => item.category === category);
                    if (categoryItems.length === 0) return null;

                    return (
                      <div key={category} className="space-y-1">
                        <div className="px-4 py-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/20">
                          {category}
                        </div>
                        {categoryItems.map(item => {
                          // Find overall index of this item
                          const globalIdx = allResults.findIndex(r => r.id === item.id);
                          const isSelected = globalIdx === selectedIndex;
                          const Icon = item.icon;

                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                item.action();
                                onClose();
                              }}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
                                isSelected 
                                  ? 'bg-[#5B3DF5] text-white' 
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                              }`}
                            >
                              <div className="flex items-center space-x-3 overflow-hidden">
                                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                                <span className="font-semibold truncate">{item.label}</span>
                              </div>
                              {isSelected && (
                                <span className="text-[9px] font-mono font-bold opacity-80 uppercase bg-white/20 px-1 rounded">
                                  Enter
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
                  <ShieldAlert className="w-8 h-8 mb-2 opacity-50" />
                  <p className="font-semibold">No results match your search query</p>
                </div>
              )}
            </div>

            {/* Sticky footer info */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-medium font-[Poppins]">
              <div className="flex items-center space-x-1">
                <span>Use</span>
                <span className="px-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-mono">↑↓</span>
                <span>keys to navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Select with</span>
                <span className="px-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-mono">⏎</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
