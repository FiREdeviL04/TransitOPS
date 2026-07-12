import React from 'react';
import { motion } from 'motion/react';
import { 
  Truck, Users, MapPin, ShieldCheck, Wrench, Fuel, CreditCard, DollarSign,
  TrendingUp, BarChart3, Clock, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { Vehicle, Driver, Trip, MaintenanceRecord, Expense } from '../types';
import KPICard from './KPICard';
import FleetMap from './FleetMap';

interface DashboardViewProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  maintenance: MaintenanceRecord[];
  expenses: Expense[];
  onNavigate: (tabId: string) => void;
  onOpenDetail: (type: 'vehicle' | 'driver' | 'trip', id: string) => void;
}

export default function DashboardView({
  vehicles,
  drivers,
  trips,
  maintenance,
  expenses,
  onNavigate,
  onOpenDetail
}: DashboardViewProps) {
  // Calculated stats
  const activeVehiclesCount = vehicles.filter(v => v.status === 'Active' || v.status === 'In Service').length;
  const driversOnDutyCount = drivers.filter(d => d.status === 'On Duty').length;
  const activeTripsCount = trips.filter(t => t.status === 'On Route' || t.status === 'Loading').length;
  const totalFleetHealth = Math.round(vehicles.reduce((acc, v) => acc + v.health, 0) / (vehicles.length || 1));
  const maintenancePendingCount = maintenance.filter(m => m.status !== 'Resolved').length;
  
  const totalFuelExp = expenses.filter(e => e.category === 'Fuel').reduce((sum, e) => sum + e.amount, 0);
  const totalMaintExp = expenses.filter(e => e.category === 'Maintenance').reduce((sum, e) => sum + e.amount, 0);
  const totalMonthlyExp = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Sparkline data examples
  const vehicleSpark = [12, 14, 15, 14, 16, 15, 17, activeVehiclesCount];
  const driverSpark = [3, 4, 3, 4, 3, 4, 4, driversOnDutyCount];
  const dispatchSpark = [1, 2, 2, 3, 2, 3, 4, activeTripsCount];
  const healthSpark = [92, 93, 91, 94, 93, 94, 94, totalFleetHealth];

  // Helper status color mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
      case 'On Duty':
      case 'On Route':
      case 'Resolved':
      case 'Completed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">● {status}</span>;
      case 'In Service':
      case 'Loading':
      case 'In Progress':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">● {status}</span>;
      case 'Maintenance':
      case 'Delayed':
      case 'Pending':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">● {status}</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">● {status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 8 KPI CARDS BENTO GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Active Vehicles"
          value={activeVehiclesCount}
          subText={`${vehicles.length} Total Units`}
          icon={Truck}
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
          iconColor="text-[#5B3DF5] dark:text-[#7C5CFC]"
          trend={{ value: 8, isPositive: true }}
          sparklineData={vehicleSpark}
        />
        <KPICard
          label="Drivers On Duty"
          value={driversOnDutyCount}
          subText={`${drivers.length} Operative Staff`}
          icon={Users}
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
          iconColor="text-emerald-600 dark:text-emerald-400"
          trend={{ value: 12, isPositive: true }}
          sparklineData={driverSpark}
        />
        <KPICard
          label="Active Dispatches"
          value={activeTripsCount}
          subText="In-Transit Freight Carriers"
          icon={MapPin}
          iconBg="bg-blue-50 dark:bg-blue-500/10"
          iconColor="text-blue-600 dark:text-blue-400"
          trend={{ value: 4, isPositive: true }}
          sparklineData={dispatchSpark}
        />
        <KPICard
          label="Fleet Health Index"
          value={`${totalFleetHealth}%`}
          subText="Proactive Safety Rating"
          icon={ShieldCheck}
          iconBg="bg-teal-50 dark:bg-teal-500/10"
          iconColor="text-teal-600 dark:text-teal-400"
          trend={{ value: 2, isPositive: true }}
          sparklineData={healthSpark}
        />
        
        <KPICard
          label="Pending Maintenance"
          value={maintenancePendingCount}
          subText={`${maintenance.filter(m => m.priority === 'Critical').length} Critical Tickets`}
          icon={Wrench}
          iconBg="bg-amber-50 dark:bg-amber-500/10"
          iconColor="text-amber-600 dark:text-amber-400"
          trend={{ value: 14, isPositive: false }}
          sparklineData={[3, 5, 4, 6, 5, 6, 7, maintenancePendingCount]}
        />
        <KPICard
          label="Fuel log spend"
          value={`$${Math.round(totalFuelExp).toLocaleString()}`}
          subText="Cumulative Month-To-Date"
          icon={Fuel}
          iconBg="bg-purple-50 dark:bg-purple-500/10"
          iconColor="text-purple-600 dark:text-purple-400"
          trend={{ value: 6, isPositive: true }}
          sparklineData={[1200, 1500, 1800, 1600, 1900, 2100, 2300, totalFuelExp]}
        />
        <KPICard
          label="Maintenance Cost"
          value={`$${Math.round(totalMaintExp).toLocaleString()}`}
          subText="Cleared Repairs Invoices"
          icon={CreditCard}
          iconBg="bg-rose-50 dark:bg-rose-500/10"
          iconColor="text-rose-600 dark:text-rose-400"
          trend={{ value: 18, isPositive: false }}
          sparklineData={[400, 600, 500, 900, 1200, 1400, 1100, totalMaintExp]}
        />
        <KPICard
          label="Cumulative monthly spend"
          value={`$${Math.round(totalMonthlyExp).toLocaleString()}`}
          subText="SaaS ERP Total Ledger"
          icon={DollarSign}
          iconBg="bg-slate-100 dark:bg-slate-800"
          iconColor="text-slate-800 dark:text-slate-200"
          trend={{ value: 5, isPositive: true }}
          sparklineData={[3000, 3500, 4200, 4800, 5100, 5400, 5800, totalMonthlyExp]}
        />
      </div>

      {/* OPERATIONS CENTER: MAP & ANALYTICS DOUBLE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Map visualization block */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex justify-between items-center bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Live Operations Telemetry Map</h3>
              <p className="text-[10px] text-slate-500">Real-time GPS tracker status of fleet dispatches</p>
            </div>
            <span className="text-[10px] font-bold text-[#5B3DF5] bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-0.5 rounded uppercase tracking-wider">
              Central Node GPS
            </span>
          </div>
          <div className="h-96">
            <FleetMap vehicles={vehicles} drivers={drivers} />
          </div>
        </div>

        {/* Right column: Capacity dial & smart insights block */}
        <div className="flex flex-col justify-between space-y-6">
          
          {/* Capacity meter */}
          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between flex-1 relative overflow-hidden group">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Operations Capacity Meter</h3>
              <p className="text-[10px] text-slate-500">Live active asset utilization ratios</p>
            </div>

            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="54" stroke="#F1F5F9" strokeWidth="12" fill="transparent" className="dark:stroke-slate-800" />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="54" 
                    stroke="#5B3DF5" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray="339.29" 
                    strokeDashoffset={339.29 * (1 - (activeVehiclesCount / (vehicles.length || 1)))} 
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                  <span className="text-3xl font-extrabold text-[#111827] dark:text-white">
                    {Math.round((activeVehiclesCount / (vehicles.length || 1)) * 100)}%
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">Utilization</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 w-full text-[10px] font-semibold text-center">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 p-2 rounded-xl">
                  <span className="block text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">{activeVehiclesCount} Active</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wide">On route</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-2 rounded-xl">
                  <span className="block text-slate-700 dark:text-slate-300 font-extrabold text-xs">{vehicles.length - activeVehiclesCount} Standby</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wide">Terminal</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Smart Insights */}
          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4.5 h-4.5 text-[#5B3DF5]" />
              <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs">SaaS Smart Insights</h4>
            </div>
            <div className="space-y-2.5">
              <div className="p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5 leading-tight">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-[10px]">Overdue Brake Inspection</span>
                  <p className="text-[9px] text-slate-400">Ford Transit vehicle #v-3 requires emergency service attention.</p>
                </div>
              </div>
              <div className="p-2.5 bg-green-500/5 border border-green-500/10 rounded-lg flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5 leading-tight">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-[10px]">Optimal Safety Compliancy</span>
                  <p className="text-[9px] text-slate-400">Average safety rating index sits comfortably at 91.5% this month.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* RECENT OPERATIONAL LOG DISPATCHES */}
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/30">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Operational Monitor Console</h3>
          <button 
            className="text-[10px] text-[#5B3DF5] hover:underline font-bold uppercase cursor-pointer" 
            onClick={() => onNavigate('trips')}
          >
            Explore all route entries →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800/80">
              <tr>
                <th className="px-5 py-3">Trip Identifier</th>
                <th className="px-5 py-3">Assigned Asset</th>
                <th className="px-5 py-3">Logistics Route</th>
                <th className="px-5 py-3">Driver Operator</th>
                <th className="px-5 py-3 text-center">Route Progress</th>
                <th className="px-5 py-3">Operational Status</th>
                <th className="px-5 py-3 text-right">Odometer Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
              {trips.slice(0, 5).map(trip => {
                const assocV = vehicles.find(v => v.id === trip.vehicleId);
                const assocD = drivers.find(d => d.id === trip.driverId);
                return (
                  <tr 
                    key={trip.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors cursor-pointer"
                    onClick={() => onOpenDetail('trip', trip.id)}
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-[#5B3DF5]">{trip.id}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-slate-800 dark:text-white">{assocV?.name || 'Unassigned'}</span>
                      <span className="block text-[10px] text-slate-400 font-mono font-semibold mt-0.5">{assocV?.plate}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-750 dark:text-slate-300">
                      {trip.departure} → {trip.destination}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      {assocD?.name || 'No driver allocated'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="bg-[#5B3DF5] h-full transition-all duration-300" style={{ width: `${trip.progress}%` }}></div>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400">{trip.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(trip.status)}</td>
                    <td className="px-5 py-3.5 text-right text-slate-400 dark:text-slate-500 font-mono text-[10px]">{trip.eta}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
