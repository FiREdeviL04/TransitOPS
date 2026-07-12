import React from 'react';
import { Plus, Trash2, CreditCard, DollarSign } from 'lucide-react';
import { Expense } from '../types';
import EmptyState from './EmptyState';

interface ExpensesViewProps {
  expenses: Expense[];
  filterBySearch: (text: string) => boolean;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export default function ExpensesView({
  expenses,
  filterBySearch,
  onAdd,
  onDelete
}: ExpensesViewProps) {
  const filteredList = expenses.filter(e => filterBySearch(e.category + e.description + (e.reference || '')));

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">General Overhead Ledger</h3>
          <p className="text-[10px] text-slate-500">Fleet expenditures, tolls, driver payroll stipends, and active invoice receipts audits</p>
        </div>
        <button
          onClick={onAdd}
          className="px-3.5 py-1.5 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Expense Voucher</span>
        </button>
      </div>

      {filteredList.length > 0 ? (
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 font-bold border-b border-slate-100 dark:border-slate-850">
              <tr>
                <th className="px-5 py-3">Audit Reference ID</th>
                <th className="px-5 py-3">Expense Category</th>
                <th className="px-5 py-3">Voucher Details / Description</th>
                <th className="px-5 py-3">Billing Stamp Date</th>
                <th className="px-5 py-3 text-right">Invoice Amount</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150/80 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
              {filteredList.map(e => (
                <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors group">
                  <td className="px-5 py-3.5 font-mono font-bold text-[#5B3DF5]">{e.reference || e.id}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/40 dark:border-slate-700/50">
                      {e.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-medium">{e.description}</td>
                  <td className="px-5 py-3.5 text-slate-400 font-medium">{e.date}</td>
                  <td className="px-5 py-3.5 text-right font-extrabold text-[#111827] dark:text-white text-xs">${e.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onDelete(e.id)}
                      className="p-1.5 hover:text-[#EF4444] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-block cursor-pointer"
                      title="Void expense log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          type="expenses"
          title="No operational expenses"
          description="There are no registered ledger entries matching your query parameters."
          actionLabel="File expense voucher"
          onAction={onAdd}
        />
      )}

    </div>
  );
}
