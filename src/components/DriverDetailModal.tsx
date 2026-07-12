import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, ShieldCheck, Clock, Phone, Award, Star, History, DollarSign } from 'lucide-react';
import { Driver, Trip } from '../types';

interface DriverDetailModalProps {
  driver: Driver | null;
  onClose: () => void;
  tripsHistory: Trip[];
}

export default function DriverDetailModal({
  driver,
  onClose,
  tripsHistory
}: DriverDetailModalProps) {
  if (!driver) return null;

  // Filter historic dispatches for this driver
  const driverTrips = tripsHistory.filter(t => t.driverId === driver.id);
  const totalEarnedBudget = driverTrips.reduce((acc, t) => acc + t.cost, 0);

  // Safety classification
  const getSafetyClass = (score: number) => {
    if (score >= 95) return { label: 'Elite Safety Status', color: 'text-green-600 bg-green-500/10' };
    if (score >= 85) return { label: 'Standard Safety Compliance', color: 'text-blue-600 bg-blue-500/10' };
    return { label: 'Audit Required', color: 'text-[#EF4444] bg-[#EF4444]/10' };
  };

  const safetyObj = getSafetyClass(driver.safetyScore);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-150 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden text-xs max-h-[90vh] flex flex-col text-[#111827] dark:text-white transition-colors duration-200"
        >
          {/* Header & Avatar Card */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-900/30">
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-2xl ${driver.avatarColor || 'bg-[#5B3DF5]'} text-white font-extrabold text-xl flex items-center justify-center shadow-lg`}>
                {driver.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#111827] dark:text-white">{driver.name}</h3>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-semibold font-mono uppercase tracking-wider">
                  <span>ID: {driver.id}</span>
                  <span>|</span>
                  <span>License: {driver.license}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:hover:text-white">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Core scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Stats Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Safety metrics rating card */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                  <span>Safety score index</span>
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold">{driver.safetyScore}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">/100</span>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold ${safetyObj.color}`}>
                  {safetyObj.label}
                </span>
              </div>

              {/* Service Hours card */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                  <span>Hours on Duty</span>
                  <Clock className="w-4 h-4 text-[#5B3DF5]" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold">{driver.hours}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Hours</span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block">
                  Month-To-Date operations
                </span>
              </div>

              {/* Estimated general ledger contribution */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                  <span>Budget managed</span>
                  <DollarSign className="w-4 h-4 text-[#38BDF8]" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                    ${totalEarnedBudget.toLocaleString()}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                  Via {driverTrips.length} dispatches
                </span>
              </div>

            </div>

            {/* Profile specifications list & Timelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Profile Details Card list */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Award className="w-4 h-4 text-[#5B3DF5]" />
                  <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Qualifications</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800 pb-1.5">
                    <span className="text-slate-400 font-semibold">License type classification</span>
                    <span className="font-bold">Commercial CDL Class-A</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800 pb-1.5">
                    <span className="text-slate-400 font-semibold">Operator status level</span>
                    <span className="font-bold text-green-500">{driver.status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800 pb-1.5">
                    <span className="text-slate-400 font-semibold">Contact mobile number</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{driver.phone}</span>
                  </div>
                  <div className="flex justify-between py-1 pb-1.5">
                    <span className="text-slate-400 font-semibold">Operational rating score</span>
                    <span className="font-bold flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                      4.8★ Rating
                    </span>
                  </div>
                </div>
              </div>

              {/* Historic associated active trips dispatcher logs */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Recent Active Dispatches</h4>
                </div>
                <div className="space-y-3">
                  {driverTrips.length > 0 ? (
                    driverTrips.map(trip => (
                      <div key={trip.id} className="p-3 bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800 rounded-lg space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-[#5B3DF5]">{trip.id}</span>
                          <span className="text-[9px] font-bold text-[#22C55E] uppercase">{trip.status}</span>
                        </div>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          {trip.departure} → {trip.destination}
                        </p>
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span>Freight: {trip.freight}</span>
                          <span className="font-bold text-slate-800 dark:text-white">${trip.cost.toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400">
                      <History className="w-8 h-8 mx-auto mb-1 opacity-30" />
                      <p className="font-semibold">No active routes found for operator</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Modal profile footer actions */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 flex justify-end space-x-2">
            <a 
              href={`tel:${driver.phone}`} 
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-[#111827] dark:text-white text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Operator</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Close Profile
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
