import React from 'react';
import { Plus, Trash2, Fuel, RefreshCw, Calendar } from 'lucide-react';
import { FuelLog, Vehicle } from '../types';
import EmptyState from './EmptyState';
import { useAuth } from '../context/AuthContext';

interface FuelLogsViewProps {
  fuelLogs: FuelLog[];
  vehicles: Vehicle[];
  filterBySearch: (text: string) => boolean;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export default function FuelLogsView({
  fuelLogs,
  vehicles,
  filterBySearch,
  onAdd,
  onDelete
}: FuelLogsViewProps) {
  const { user } = useAuth();
  const isDriver = user?.role === 'Driver';
  const filteredList = fuelLogs.filter(f => filterBySearch(f.station));

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Fuel Telemetry Journals</h3>
          <p className="text-[10px] text-slate-500">Audit logs of transit refilling stations, volumes, odometer syncs, and direct spending invoices</p>
        </div>
        <button
          onClick={onAdd}
          className="px-3.5 py-1.5 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Refuel Entry</span>
        </button>
      </div>

      {filteredList.length > 0 ? (
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 font-bold border-b border-slate-100 dark:border-slate-850">
              <tr>
                <th className="px-5 py-3">Journal Entry ID</th>
                <th className="px-5 py-3">Transit Machine Link</th>
                <th className="px-5 py-3">Refill Volume (Gallons)</th>
                <th className="px-5 py-3">Price Rate / Gallon</th>
                <th className="px-5 py-3">Station Brand / Outlet</th>
                <th className="px-5 py-3">Registered Odometer</th>
                <th className="px-5 py-3">Audit Date</th>
                <th className="px-5 py-3 font-semibold">Expenditure Amount</th>
                {!isDriver && <th className="px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150/80 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
              {filteredList.map(f => {
                const v = vehicles.find(x => x.id === f.vehicleId);
                return (
                  <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors group">
                    <td className="px-5 py-3.5 font-mono text-slate-400 dark:text-slate-500">#{f.id.substring(0, 8)}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-extrabold text-slate-800 dark:text-white flex items-center space-x-1.5">
                        <Fuel className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#5B3DF5]" />
                        <span>{v?.name || 'Unassigned'}</span>
                      </div>
                      <span className="block text-[10px] text-slate-400 font-mono font-bold mt-0.5">PLATE: {v?.plate}</span>
                    </td>
                    <td className="px-5 py-3.5 font-extrabold text-slate-800 dark:text-slate-200">{f.volume} gal</td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">${f.pricePerUnit} /gal</td>
                    <td className="px-5 py-3.5 text-slate-800 dark:text-slate-300 font-semibold">{f.station}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-500 dark:text-slate-450">{f.odometer.toLocaleString()} mi</td>
                    <td className="px-5 py-3.5 text-slate-400 font-medium">{f.date}</td>
                    <td className="px-5 py-3.5 font-extrabold text-[#111827] dark:text-white text-xs">${f.totalCost.toLocaleString()}</td>
                    {!isDriver && (
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => onDelete(f.id)}
                          className="p-1.5 hover:text-[#EF4444] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-block cursor-pointer"
                          title="Delete entry voucher"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          type="fuel"
          title="No fuel logs found"
          description="We couldn't retrieve any fuel telemetry entries matching that criteria."
          actionLabel="Add custom log entry"
          onAction={onAdd}
        />
      )}

    </div>
  );
}
