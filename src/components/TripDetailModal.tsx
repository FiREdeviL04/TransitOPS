import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Truck, Users, Package, DollarSign, Clock, CheckCircle2, ShieldCheck, Fuel, Milestone } from 'lucide-react';
import { Trip, Vehicle, Driver } from '../types';

interface TripDetailModalProps {
  trip: Trip | null;
  onClose: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  onCompleteTrip?: (tripId: string, fuelVolume: number, distance: number, finalOdometer: number) => void;
  onCancelTrip?: (tripId: string) => void;
}

export default function TripDetailModal({
  trip,
  onClose,
  vehicles,
  drivers,
  onCompleteTrip,
  onCancelTrip
}: TripDetailModalProps) {
  if (!trip) return null;

  // Retrieve assigned items
  const vehicle = vehicles.find(v => v.id === trip.vehicleId);
  const driver = drivers.find(d => d.id === trip.driverId);

  // Local state for completion form
  const [isCompleting, setIsCompleting] = useState(false);
  const [fuelVolume, setFuelVolume] = useState('145');
  const [distance, setDistance] = useState('320');
  const [finalOdometer, setFinalOdometer] = useState(
    vehicle ? String(110000 + Math.floor(Math.random() * 2000)) : '110450'
  );

  const [validationError, setValidationError] = useState('');

  // Status mapping
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'Completed':
        return { label: 'Route Completed', color: 'text-green-600 bg-green-500/10' };
      case 'On Route':
        return { label: 'Active In-Transit', color: 'text-blue-600 bg-blue-500/10' };
      case 'Loading':
        return { label: 'At Loading Dock', color: 'text-amber-500 bg-amber-500/10' };
      case 'Cancelled':
        return { label: 'Dispatch Cancelled', color: 'text-rose-500 bg-rose-500/10' };
      default:
        return { label: 'Pending Dispatch', color: 'text-slate-400 bg-slate-100' };
    }
  };

  const statusObj = getStatusDetails(trip.status);

  const handleSubmitCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    const fuelVal = parseFloat(fuelVolume);
    const distVal = parseFloat(distance);
    const odoVal = parseFloat(finalOdometer);

    if (isNaN(fuelVal) || fuelVal < 0) {
      setValidationError('Please enter a valid, non-negative fuel volume.');
      return;
    }
    if (isNaN(distVal) || distVal < 0) {
      setValidationError('Please enter a valid, non-negative transit distance.');
      return;
    }
    if (isNaN(odoVal) || odoVal < 0) {
      setValidationError('Please enter a valid, non-negative odometer reading.');
      return;
    }

    setValidationError('');
    if (onCompleteTrip) {
      onCompleteTrip(trip.id, fuelVal, distVal, odoVal);
    }
  };

  const isActive = trip.status === 'On Route' || trip.status === 'Loading' || trip.status === 'Delayed';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-150 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden text-xs text-[#111827] dark:text-white transition-colors duration-200"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/30">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-[#5B3DF5]/10 text-[#5B3DF5] rounded-lg">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Freight Route Dispatch</h3>
                <span className="text-[10px] text-slate-400 font-mono font-bold">{trip.id}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:hover:text-white cursor-pointer">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Details / Completion Form */}
          <div className="p-6 space-y-6">
            
            {/* Visual animated Progress path */}
            <div className="space-y-3">
              <div className="flex justify-between items-center font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{trip.departure}</span>
                </div>
                <div className="flex-1 border-t border-dashed border-slate-300 mx-3 relative flex justify-center">
                  <span className="absolute -top-3 px-2 bg-white dark:bg-[#1E293B] text-[9px] font-bold text-[#5B3DF5]">
                    {trip.progress}% ETA
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{trip.destination}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative shadow-inner">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${trip.progress}%` }}
                   transition={{ duration: 0.6, ease: 'easeOut' }}
                   className="bg-gradient-to-r from-[#5B3DF5] to-[#38BDF8] h-full"
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold uppercase">
                <span>EST departure {trip.date}</span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${statusObj.color}`}>
                  {statusObj.label}
                </span>
                <span>ETA: {trip.eta}</span>
              </div>
            </div>

            {isCompleting ? (
              <form onSubmit={handleSubmitCompletion} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h4 className="text-sm font-bold text-[#5B3DF5] flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enter Logistics Completion Parameters</span>
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                  Audit fuel refill volumes, precise odometer tracking benchmarks, and mechanical metrics to release driver and vehicle resources back to active pools.
                </p>

                {validationError && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg font-bold text-[11px]">
                    ⚠️ {validationError}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Fuel Refilled (gal)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={fuelVolume}
                      onChange={e => setFuelVolume(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      placeholder="145"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Distance (miles)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={distance}
                      onChange={e => setDistance(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      placeholder="320"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Final Odometer (mi)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={finalOdometer}
                      onChange={e => setFinalOdometer(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      placeholder="110450"
                    />
                  </div>
                </div>

                <div className="flex space-x-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCompleting(false)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-[10px] uppercase font-extrabold text-slate-600 dark:text-slate-350 cursor-pointer"
                  >
                    Cancel Form
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] uppercase font-extrabold flex items-center space-x-1.5 shadow-md shadow-emerald-600/10 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Completion</span>
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* General Specs Grid layout */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-slate-800 py-4">
                  
                  {/* Vehicle link card */}
                  <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Truck className="w-4 h-4 text-[#5B3DF5]" />
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Assigned Asset</span>
                      <span className="font-bold text-slate-800 dark:text-white block">{vehicle?.name || 'No vehicle'}</span>
                      <span className="text-[8px] font-mono font-semibold text-slate-500 block">{vehicle?.plate}</span>
                    </div>
                  </div>

                  {/* Driver Operator link card */}
                  <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Users className="w-4 h-4 text-green-500" />
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Allocated Driver</span>
                      <span className="font-bold text-slate-800 dark:text-white block">{driver?.name || 'No driver'}</span>
                      <span className="text-[8px] text-slate-500 block font-semibold">CDL: {driver?.license}</span>
                    </div>
                  </div>

                  {/* Cargo specs */}
                  <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Package className="w-4 h-4 text-[#38BDF8]" />
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Freight Cargo</span>
                      <span className="font-bold text-slate-800 dark:text-white block truncate max-w-[120px]">{trip.freight}</span>
                    </div>
                  </div>

                  {/* Budget expense ledger */}
                  <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Voucher Budget</span>
                      <span className="font-bold text-slate-800 dark:text-white block">${trip.cost.toLocaleString()}</span>
                    </div>
                  </div>

                </div>

                {/* Smart logistics checkups alert */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl flex items-start space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 dark:text-white block">Logistics Compliance Lock</span>
                    <p className="text-[10px] text-slate-500">
                      Asset weight ratios, safety scoring clearance indices, and active driver schedules are currently in full compliance.
                    </p>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-between">
            {/* Context-aware lifecycle triggers */}
            <div className="flex space-x-1.5">
              {isActive && !isCompleting && (
                <>
                  <button
                    onClick={() => {
                      if (confirm('Cancel transit dispatch route? Restores vehicle and driver operators immediately.')) {
                        onCancelTrip?.(trip.id);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-lg text-[10px] uppercase font-extrabold transition-all cursor-pointer"
                  >
                    Cancel Trip
                  </button>
                  <button
                    onClick={() => setIsCompleting(true)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-[10px] uppercase font-extrabold transition-all cursor-pointer"
                  >
                    Complete Trip
                  </button>
                </>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md shadow-[#5B3DF5]/15"
            >
              Done Reviewing
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
