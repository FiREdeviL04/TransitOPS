import React from 'react';
import { Plus, Edit2, Trash2, Map, Calendar, DollarSign, Compass } from 'lucide-react';
import { Trip, Vehicle, Driver } from '../types';
import EmptyState from './EmptyState';
import { useAuth } from '../context/AuthContext';

interface TripsViewProps {
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  filterBySearch: (text: string) => boolean;
  onAdd: () => void;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
  onOpenDetail: (id: string) => void;
}

export default function TripsView({
  trips,
  vehicles,
  drivers,
  filterBySearch,
  onAdd,
  onEdit,
  onDelete,
  onOpenDetail
}: TripsViewProps) {
  const { user } = useAuth();
  const isDriver = user?.role === 'Driver';
  const filteredList = trips.filter(t => filterBySearch(t.id + t.destination + t.departure + t.freight));

  // Helpers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'On Route':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-[#5B3DF5] dark:bg-indigo-500/10 dark:text-[#7C5CFC]">● On Route</span>;
      case 'Completed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">● Completed</span>;
      case 'Loading':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">● Loading</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">● Pending</span>;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {isDriver ? 'My Logged Cargo Dispatches' : 'Active Freight Dispatches'}
          </h3>
          <p className="text-[10px] text-slate-500">
            {isDriver ? 'View your active freight milestones, routes, and estimated arrival updates' : 'Live trip logging, allocated heavy hauling machinery, and budget milestones'}
          </p>
        </div>
        {!isDriver && (
          <button
            onClick={onAdd}
            className="px-3.5 py-1.5 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Dispatch New Route</span>
          </button>
        )}
      </div>

      {filteredList.length > 0 ? (
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 font-bold border-b border-slate-100 dark:border-slate-850">
              <tr>
                <th className="px-4 py-3">Trip Identifier</th>
                <th className="px-4 py-3">Logistics Route</th>
                <th className="px-4 py-3">Allocated Asset</th>
                <th className="px-4 py-3">Assigned Driver</th>
                <th className="px-4 py-3">Freight Cargo Type</th>
                <th className="px-4 py-3 text-center">Route Progress</th>
                <th className="px-4 py-3">Operational Status</th>
                <th className="px-4 py-3">Budget Allocation</th>
                {!isDriver && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150/80 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
              {filteredList.map(t => {
                const v = vehicles.find(x => x.id === t.vehicleId);
                const d = drivers.find(x => x.id === t.driverId);
                return (
                  <tr 
                    key={t.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors group cursor-pointer"
                    onClick={() => onOpenDetail(t.id)}
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-[#5B3DF5]">{t.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-[#111827] dark:text-white flex items-center space-x-1.5 text-xs">
                        <Compass className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#5B3DF5]" />
                        <span>{t.departure} → {t.destination}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-bold mt-0.5 pl-5 uppercase">ESTIMATED: {t.eta}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{v?.name || 'Unassigned'}</span>
                      <span className="block text-[10px] text-slate-400 font-mono font-bold mt-0.5">PLATE: {v?.plate}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 font-semibold">{d?.name || 'Unassigned Operator'}</td>
                    <td className="px-4 py-3.5 text-slate-500 font-medium">{t.freight}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[10px]">{t.progress}%</span>
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                          <div className="bg-[#5B3DF5] h-full" style={{ width: `${t.progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">{getStatusBadge(t.status)}</td>
                    <td className="px-4 py-3.5 font-extrabold text-slate-800 dark:text-slate-200 text-xs">${t.cost.toLocaleString()}</td>
                    {!isDriver && (
                      <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => onEdit(t)}
                            className="p-1.5 hover:text-[#5B3DF5] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-block cursor-pointer"
                            title="Modify trip parameter logs"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(t.id)}
                            className="p-1.5 hover:text-[#EF4444] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-block cursor-pointer"
                            title="Delete trip log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
          type="trips"
          title="No dispatches matched"
          description="We couldn't retrieve any active logistics dispatches matching your query terms."
          actionLabel={isDriver ? undefined : "Dispatch new route"}
          onAction={isDriver ? undefined : onAdd}
        />
      )}

    </div>
  );
}
