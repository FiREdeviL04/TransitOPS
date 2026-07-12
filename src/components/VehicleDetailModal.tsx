import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Truck, Wrench, MapPin, Gauge, ShieldCheck, Fuel, Calendar, History, Activity } from 'lucide-react';
import { Vehicle, MaintenanceRecord, Trip } from '../types';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  maintenanceHistory: MaintenanceRecord[];
  tripsHistory: Trip[];
}

export default function VehicleDetailModal({
  vehicle,
  onClose,
  maintenanceHistory,
  tripsHistory
}: VehicleDetailModalProps) {
  if (!vehicle) return null;

  // Filter relevant logs
  const vehicleMaint = maintenanceHistory.filter(m => m.vehicleId === vehicle.id);
  const vehicleTrips = tripsHistory.filter(t => t.vehicleId === vehicle.id);

  // Health rating text helper
  const getHealthStatus = (score: number) => {
    if (score >= 90) return { label: 'Optimal Health Rating', color: 'text-green-500 bg-green-500/10' };
    if (score >= 75) return { label: 'Satisfactory Rating', color: 'text-blue-500 bg-blue-500/10' };
    return { label: 'Attention Required', color: 'text-rose-500 bg-rose-500/10' };
  };

  const healthObj = getHealthStatus(vehicle.health);

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
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#5B3DF5]/10 text-[#5B3DF5] rounded-xl">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">{vehicle.name}</h3>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">PLATE: {vehicle.plate}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:hover:text-white">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Scrollable Workspace Details */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Top Stats Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Asset Health Widget */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                  <span>Telemetry Health</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold">{vehicle.health}%</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Score</span>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${healthObj.color}`}>
                  {healthObj.label}
                </span>
              </div>

              {/* Fuel Level Widget */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                  <span>Fuel Gauge</span>
                  <Fuel className="w-4 h-4 text-[#5B3DF5]" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold">{vehicle.fuel}%</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Volume</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${vehicle.fuel > 40 ? 'bg-[#5B3DF5]' : 'bg-[#EF4444]'}`} 
                    style={{ width: `${vehicle.fuel}%` }}
                  />
                </div>
              </div>

              {/* Asset Threshold Capacity */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                  <span>Asset Capacity</span>
                  <Gauge className="w-4 h-4 text-[#38BDF8]" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold truncate">{vehicle.capacity}</span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                  Class: {vehicle.type}
                </span>
              </div>

            </div>

            {/* Timelines split layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Maintenance Work Orders */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Wrench className="w-4 h-4 text-[#5B3DF5]" />
                  <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Maintenance Records</h4>
                </div>
                <div className="space-y-3">
                  {vehicleMaint.length > 0 ? (
                    vehicleMaint.map(maint => (
                      <div key={maint.id} className="p-3 bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800 rounded-lg space-y-1.5 relative">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800 dark:text-white">{maint.type}</span>
                          <span className="text-[10px] font-bold text-slate-400">${maint.cost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          <span>{maint.technician}</span>
                          <span className="font-mono text-[9px]">{maint.date}</span>
                        </div>
                        <div className="pt-1 flex items-center justify-between">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${maint.priority === 'Critical' ? 'bg-[#EF4444]/15 text-[#EF4444]' : 'bg-amber-500/15 text-amber-500'}`}>
                            {maint.priority}
                          </span>
                          <span className="text-[9px] font-bold text-[#5B3DF5] uppercase">{maint.status}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400">
                      <History className="w-8 h-8 mx-auto mb-1 opacity-30" />
                      <p className="font-semibold">No maintenance events found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Active and Historic Dispatches */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Freight Trip History</h4>
                </div>
                <div className="space-y-3">
                  {vehicleTrips.length > 0 ? (
                    vehicleTrips.map(trip => (
                      <div key={trip.id} className="p-3 bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800 rounded-lg space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-[#5B3DF5]">{trip.id}</span>
                          <span className="text-[9px] font-bold text-slate-400">{trip.date}</span>
                        </div>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          {trip.departure} → {trip.destination}
                        </p>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase">{trip.freight}</span>
                          <span className="font-bold text-slate-800 dark:text-white">${trip.cost.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-[#5B3DF5]" style={{ width: `${trip.progress}%` }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400">
                      <History className="w-8 h-8 mx-auto mb-1 opacity-30" />
                      <p className="font-semibold">No freight dispatch history found</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Bottom actions bar */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
              Last serviced: {vehicle.lastService}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#111827] dark:text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Close Asset Panel
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
