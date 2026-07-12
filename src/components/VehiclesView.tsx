import React from 'react';
import { Plus, Edit2, Trash2, Fuel, Truck, AlertCircle, Sparkles } from 'lucide-react';
import { Vehicle } from '../types';
import EmptyState from './EmptyState';
import { useAuth } from '../context/AuthContext';

interface VehiclesViewProps {
  vehicles: Vehicle[];
  filterBySearch: (text: string) => boolean;
  onAdd: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onOpenDetail: (id: string) => void;
}

export default function VehiclesView({
  vehicles,
  filterBySearch,
  onAdd,
  onEdit,
  onDelete,
  onOpenDetail
}: VehiclesViewProps) {
  const { user } = useAuth();
  const isDriver = user?.role === 'Driver';
  const filteredList = vehicles.filter(v => filterBySearch(v.name + v.plate + v.type));

  // Helpers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">● Active Online</span>;
      case 'In Service':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">● In Service</span>;
      case 'Maintenance':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">● Maintenance</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">● Standby</span>;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Top action header banner */}
      <div className="flex justify-between items-center bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {isDriver ? 'My Assigned Vehicle Spec' : 'Corporate Fleet Inventory'}
          </h3>
          <p className="text-[10px] text-slate-500">
            {isDriver ? 'Your assigned heavy transit carrier telemetry, health indicators, and registration' : 'Authorized heavy transit haulers, electric carrier vans, and telemetry checkups'}
          </p>
        </div>
        {!isDriver && (
          <button
            onClick={onAdd}
            className="px-3.5 py-1.5 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Asset</span>
          </button>
        )}
      </div>

      {filteredList.length > 0 ? (
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 font-bold border-b border-slate-100 dark:border-slate-850">
              <tr>
                <th className="px-5 py-3">Asset Brand / Plate ID</th>
                <th className="px-5 py-3">Vehicle Class</th>
                <th className="px-5 py-3">Load Capacity Limit</th>
                <th className="px-5 py-3">Fuel Level Volume</th>
                <th className="px-5 py-3">Telemetry Health</th>
                <th className="px-5 py-3">Last Service Stamp</th>
                <th className="px-5 py-3">Logistics Status</th>
                {!isDriver && <th className="px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150/80 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
              {filteredList.map(v => (
                <tr 
                  key={v.id} 
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors group cursor-pointer"
                  onClick={() => onOpenDetail(v.id)}
                >
                  <td className="px-5 py-3.5">
                    <div className="font-extrabold text-[#111827] dark:text-white text-xs flex items-center space-x-2">
                      <Truck className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#5B3DF5] transition-colors" />
                      <span>{v.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono font-bold mt-0.5 pl-5">PLATE: {v.plate}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-semibold">{v.type}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">{v.capacity}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[10px]">{v.fuel}%</span>
                      <div className="w-14 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full ${v.fuel > 40 ? 'bg-[#5B3DF5]' : 'bg-[#EF4444]'}`} 
                          style={{ width: `${v.fuel}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center font-bold ${v.health >= 85 ? 'text-green-500' : v.health >= 70 ? 'text-amber-500' : 'text-[#EF4444]'}`}>
                      {v.health}% Score
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-medium">{v.lastService}</td>
                  <td className="px-5 py-3.5">{getStatusBadge(v.status)}</td>
                  {!isDriver && (
                    <td className="px-5 py-3.5 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onEdit(v)}
                          className="p-1.5 hover:text-[#5B3DF5] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-block cursor-pointer"
                          title="Edit credentials"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(v.id)}
                          className="p-1.5 hover:text-[#EF4444] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-block cursor-pointer"
                          title="Decommission vehicle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          type="vehicles"
          title="No registered vehicles found"
          description="We couldn't locate any transit vehicles matching that specific search term."
          actionLabel={isDriver ? undefined : "Add custom vehicle"}
          onAction={isDriver ? undefined : onAdd}
        />
      )}
    </div>
  );
}
