import React from 'react';
import { Plus, Users, Star, Shield, Award, Edit2, Trash2 } from 'lucide-react';
import { Driver } from '../types';
import EmptyState from './EmptyState';

interface DriversViewProps {
  drivers: Driver[];
  filterBySearch: (text: string) => boolean;
  onAdd: () => void;
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
  onOpenDetail: (id: string) => void;
}

export default function DriversView({
  drivers,
  filterBySearch,
  onAdd,
  onEdit,
  onDelete,
  onOpenDetail
}: DriversViewProps) {
  const filteredList = drivers.filter(d => filterBySearch(d.name + d.license + d.status));

  // Helpers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'On Duty':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">● On Duty</span>;
      case 'Active':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">● Active</span>;
      case 'Off Duty':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">● Off Duty</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">● On Leave</span>;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Top Header Banner */}
      <div className="flex justify-between items-center bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Operators & Drivers Roster</h3>
          <p className="text-[10px] text-slate-500">Baseline safety scores, certified CDL qualifications, and duty logs tracking</p>
        </div>
        <button
          onClick={onAdd}
          className="px-3.5 py-1.5 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Operator</span>
        </button>
      </div>

      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map(d => (
            <div 
              key={d.id} 
              onClick={() => onOpenDetail(d.id)}
              className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-xs hover:shadow-md hover:border-[#5B3DF5]/20 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-11 h-11 rounded-xl ${d.avatarColor || 'bg-indigo-600'} text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-[#5B3DF5]/10 shrink-0 uppercase`}>
                    {d.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#111827] dark:text-white text-xs group-hover:text-[#5B3DF5] transition-colors">{d.name}</h4>
                    <span className="text-[10px] text-slate-400 block font-mono font-bold mt-0.5">LIC: {d.license}</span>
                  </div>
                </div>
                {getStatusBadge(d.status)}
              </div>

              {/* Stats detail indicators */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 grid grid-cols-2 gap-3 text-[10px] font-bold text-slate-500">
                <div className="space-y-1">
                  <span className="block text-slate-400 text-[9px] uppercase tracking-wider">Service Hours</span>
                  <span className="text-slate-800 dark:text-slate-200 text-xs font-extrabold">{d.hours} hrs</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-slate-400 text-[9px] uppercase tracking-wider">Safety Index</span>
                  <span className={`text-xs font-extrabold flex items-center ${d.safetyScore >= 90 ? 'text-green-500' : d.safetyScore >= 80 ? 'text-amber-500' : 'text-[#EF4444]'}`}>
                    <Star className="w-3.5 h-3.5 fill-current mr-1 text-amber-400" />
                    {d.safetyScore}/100
                  </span>
                </div>
              </div>

              {/* Bottom detail credentials */}
              <div 
                className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-50 dark:border-slate-800/40 pt-3"
                onClick={e => e.stopPropagation()}
              >
                <span className="font-mono font-semibold">{d.phone}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(d)}
                    className="text-[#5B3DF5] hover:underline font-bold uppercase cursor-pointer"
                  >
                    Modify
                  </button>
                  <span className="text-slate-200 dark:text-slate-800">|</span>
                  <button
                    onClick={() => onDelete(d.id)}
                    className="text-[#EF4444] hover:underline font-bold uppercase cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          type="drivers"
          title="No driver operators found"
          description="We couldn't locate any operators matching your current filter credentials."
          actionLabel="Onboard new driver"
          onAction={onAdd}
        />
      )}

    </div>
  );
}
