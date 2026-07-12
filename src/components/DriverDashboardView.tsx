import React from 'react';
import { 
  Calendar, MapPin, Gauge, ShieldCheck, Award, TrendingUp, AlertTriangle, Clock, 
  ArrowRight, Compass, CheckCircle2, Navigation, LucideIcon 
} from 'lucide-react';
import { Vehicle, Driver, Trip } from '../types';

interface DriverDashboardViewProps {
  driver: Driver;
  vehicles: Vehicle[];
  trips: Trip[];
  notifications: any[];
  onNavigate: (tabId: string) => void;
  onOpenDetail: (type: 'vehicle' | 'driver' | 'trip', id: string) => void;
}

export default function DriverDashboardView({
  driver,
  vehicles,
  trips,
  notifications,
  onNavigate,
  onOpenDetail
}: DriverDashboardViewProps) {
  // Filter trips for this driver
  const myTrips = trips.filter(t => t.driverId === driver.id);
  const activeTrip = myTrips.find(t => t.status === 'On Route' || t.status === 'Loading');
  
  // Find current assigned vehicle
  const currentVehicle = activeTrip 
    ? vehicles.find(v => v.id === activeTrip.vehicleId) 
    : (vehicles.find(v => v.id === 'v-1') || vehicles[0]);

  // Personal notifications (limit to personal ones or general notices)
  const personalNotifications = notifications.slice(0, 3);

  // Stats
  const tripsCompletedCount = myTrips.filter(t => t.status === 'Completed').length;
  const upcomingTrips = myTrips.filter(t => t.status === 'Pending' || t.status === 'Loading');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Welcome Card */}
      <div className="bg-gradient-to-r from-[#5B3DF5] to-[#7C5CFC] rounded-2xl p-6 text-white shadow-xl shadow-[#5B3DF5]/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Navigation className="w-48 h-48 rotate-45" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#E0D7FF]">Driver Portal Workstation</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Welcome Back, {driver.name}!
              </h1>
              <p className="text-xs text-[#E0D7FF] mt-1 font-semibold">
                ID: {driver.id} • Clearance: Active Duty Operator
              </p>
            </div>
            
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 self-start sm:self-auto">
              <Award className="w-8 h-8 text-amber-300" />
              <div>
                <span className="block text-[10px] font-bold text-slate-200 uppercase tracking-wider">Safety Index</span>
                <span className="text-lg font-black text-white">{driver.safetyScore} / 100</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-white/10 text-xs">
            <div>
              <span className="block text-slate-200 font-bold text-[10px] uppercase">Current Assignment</span>
              <span className="font-bold text-white text-sm mt-0.5 block truncate">
                {activeTrip ? `Cargo to ${activeTrip.destination}` : 'Standby / Idle'}
              </span>
            </div>
            <div>
              <span className="block text-slate-200 font-bold text-[10px] uppercase">Duty Vehicle</span>
              <span className="font-bold text-white text-sm mt-0.5 block">
                {currentVehicle ? currentVehicle.name : 'Unassigned'}
              </span>
            </div>
            <div>
              <span className="block text-slate-200 font-bold text-[10px] uppercase">License Expiry</span>
              <span className="font-bold text-white text-sm mt-0.5 block">
                {driver.licenseExpiry || '2028-11-15'}
              </span>
            </div>
            <div>
              <span className="block text-slate-200 font-bold text-[10px] uppercase">Today's Distance</span>
              <span className="font-bold text-white text-sm mt-0.5 block">
                {driver.todayDistance || 245} Miles
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Trip Panel */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
            <div className="flex justify-between items-center mb-4 border-b border-slate-50 dark:border-slate-800/50 pb-3">
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Active Duty Assignment</h2>
                <p className="text-[10px] text-slate-500 mt-0.5">Real-time dispatcher route telemetry and freight specifications</p>
              </div>
              {activeTrip && (
                <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md text-[10px] font-black uppercase tracking-wider">
                  {activeTrip.status}
                </span>
              )}
            </div>

            {activeTrip ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <Compass className="w-5 h-5 text-[#5B3DF5]" />
                      </div>
                      <div>
                        <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Route Waypoints</span>
                        <span className="font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                          {activeTrip.departure} <ArrowRight className="w-3.5 h-3.5 text-slate-400" /> {activeTrip.destination}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <Award className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Freight / Cargo</span>
                        <span className="font-bold text-xs text-slate-700 dark:text-slate-200 block mt-0.5">
                          {activeTrip.freight}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <Clock className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Estimated Time of Arrival</span>
                        <span className="font-bold text-xs text-slate-700 dark:text-slate-200 block mt-0.5">
                          {activeTrip.eta}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-[#5B3DF5]" />
                      </div>
                      <div>
                        <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Trip Logistics Code</span>
                        <span className="font-mono text-xs text-slate-500 block mt-0.5">
                          {activeTrip.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-3 border-t border-slate-50 dark:border-slate-800/40">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Route Completion Progress</span>
                    <span className="font-extrabold text-[#5B3DF5]">{activeTrip.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#5B3DF5] to-[#7C5CFC] rounded-full transition-all duration-500" 
                      style={{ width: `${activeTrip.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => onOpenDetail('trip', activeTrip.id)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    View Dispatch Timeline
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center flex flex-col items-center justify-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-xs">You Are Currently Off-Route</h3>
                <p className="text-[10px] text-slate-400 max-w-xs">No active transit tasks registered for your ID at this hour. Ensure pre-trip check was logged.</p>
              </div>
            )}
          </div>

          {/* Upcoming Trips List */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
            <div className="mb-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Upcoming Logistics Schedule</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Pre-dispatched cargo lines and terminal slots allocated</p>
            </div>

            {upcomingTrips.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {upcomingTrips.map(trip => (
                  <div key={trip.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-700 dark:text-slate-200 block">
                        {trip.departure} to {trip.destination}
                      </span>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold">
                        <span>Cargo: {trip.freight}</span>
                        <span>•</span>
                        <span>ETA: {trip.eta}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded text-[9px] font-extrabold uppercase">
                        {trip.status}
                      </span>
                      <button
                        onClick={() => onOpenDetail('trip', trip.id)}
                        className="p-1 hover:bg-slate-50 dark:hover:bg-slate-900 text-[#5B3DF5] rounded"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 py-4 text-center">No upcoming trips on the roster.</p>
            )}
          </div>

        </div>

        {/* Right 1 Column */}
        <div className="space-y-6">
          
          {/* Active Duty Vehicle Detail */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
            <div className="mb-4 border-b border-slate-50 dark:border-slate-800/50 pb-3">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Current Assigned Vehicle</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Asset health telemetry, registration index and capacity stats</p>
            </div>

            {currentVehicle ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
                    <Gauge className="w-6 h-6 text-[#5B3DF5]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 dark:text-white">{currentVehicle.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400 font-bold block">{currentVehicle.plate} • {currentVehicle.type}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 text-xs font-bold pt-1">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-1">
                    <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Fuel Volume</span>
                    <span className={`text-sm font-black ${currentVehicle.fuel < 20 ? 'text-rose-500' : 'text-[#5B3DF5]'}`}>
                      {currentVehicle.fuel}%
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-1">
                    <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Asset Health</span>
                    <span className={`text-sm font-black ${currentVehicle.health < 75 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {currentVehicle.health}%
                    </span>
                  </div>
                </div>

                <div className="text-[10px] space-y-2 pt-2 border-t border-slate-50 dark:border-slate-800/40 font-bold text-slate-500">
                  <div className="flex justify-between">
                    <span>Capacity Limit:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{currentVehicle.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Routine Check:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{currentVehicle.lastService}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('vehicles')}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    View My Vehicle Blueprint
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 py-4 text-center">No assigned vehicle found.</p>
            )}
          </div>

          {/* Personal Activity Timeline */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
            <div className="mb-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Personal Activity Logs</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Chronological record of workstation syncs and fuel logging</p>
            </div>

            <div className="relative pl-4 border-l border-slate-100 dark:border-slate-800 space-y-4">
              {(driver.recentActivity || [
                'Logged fuel volume at Pilot Center Denver',
                'Completed cargo transit route TR-8944',
                'Pre-trip checks approved'
              ]).map((act, index) => (
                <div key={index} className="relative text-xs">
                  <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-[#5B3DF5] border-2 border-white dark:border-[#1E293B]" />
                  <span className="font-semibold text-slate-600 dark:text-slate-300 block leading-relaxed">{act}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
