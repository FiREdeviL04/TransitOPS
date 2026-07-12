import React from 'react';
import { Plus, Edit2, Trash2, ShieldAlert, CheckCircle, Wrench } from 'lucide-react';
import { MaintenanceRecord, Vehicle } from '../types';
import EmptyState from './EmptyState';

interface MaintenanceViewProps {
  maintenance: MaintenanceRecord[];
  vehicles: Vehicle[];
  filterBySearch: (text: string) => boolean;
  onAdd: () => void;
  onEdit: (record: MaintenanceRecord) => void;
  onDelete: (id: string) => void;
}

export default function MaintenanceView({
  maintenance,
  vehicles,
  filterBySearch,
  onAdd,
  onEdit,
  onDelete
}: MaintenanceViewProps) {
  const filteredList = maintenance.filter(m => filterBySearch(m.type + m.technician + m.priority));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">● Resolved</span>;
      case 'In Progress':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">● In Progress</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">● Pending Check</span>;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Corporate Repair & Inspections Desk</h3>
          <p className="text-[10px] text-slate-500">Scheduled tune-ups, mechanical brake/transmission rebuild tickets, and warranty records</p>
        </div>
        <button
          onClick={onAdd}
          className="px-3.5 py-1.5 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Work Ticket</span>
        </button>
      </div>

      {filteredList.length > 0 ? (
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 font-bold border-b border-slate-100 dark:border-slate-850">
              <tr>
                <th className="px-5 py-3">Work Ticket ID</th>
                <th className="px-5 py-3">Linked Transit Asset</th>
                <th className="px-5 py-3">Mechanical Overhaul Type</th>
                <th className="px-5 py-3">Target Depot/Contractor</th>
                <th className="px-5 py-3">Severity Level</th>
                <th className="px-5 py-3">Scheduled Date</th>
                <th className="px-5 py-3">Invoiced Cost</th>
                <th className="px-5 py-3">Duty Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150/80 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
              {filteredList.map(m => {
                const v = vehicles.find(x => x.id === m.vehicleId);
                return (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors group">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-400 dark:text-slate-500">#{m.id.substring(0, 8)}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-extrabold text-slate-800 dark:text-white flex items-center space-x-1.5">
                        <Wrench className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#5B3DF5]" />
                        <span>{v?.name || 'Unassigned'}</span>
                      </div>
                      <span className="block text-[10px] text-slate-400 font-mono font-bold mt-0.5">PLATE: {v?.plate}</span>
                    </td>
                    <td className="px-5 py-3.5 font-extrabold text-slate-800 dark:text-slate-200">{m.type}</td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{m.technician}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${m.priority === 'Critical' ? 'bg-red-50 text-[#EF4444] dark:bg-red-500/10' : m.priority === 'Medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' : 'bg-slate-50 text-slate-500 dark:bg-slate-800/60'}`}>
                        {m.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-medium">{m.date}</td>
                    <td className="px-5 py-3.5 font-extrabold text-slate-800 dark:text-slate-200 text-xs">${m.cost.toLocaleString()}</td>
                    <td className="px-5 py-3.5">{getStatusBadge(m.status)}</td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onEdit(m)}
                          className="p-1.5 hover:text-[#5B3DF5] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-block cursor-pointer"
                          title="Modify ticket configurations"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(m.id)}
                          className="p-1.5 hover:text-[#EF4444] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-block cursor-pointer"
                          title="Discard maintenance ticket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          type="maintenance"
          title="No repair tickets found"
          description="We couldn't locate any mechanical repair tickets matching your search query."
          actionLabel="File work ticket"
          onAction={onAdd}
        />
      )}

    </div>
  );
}
