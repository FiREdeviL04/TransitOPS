import React from 'react';
import { Settings, ShieldCheck, Database, Sliders } from 'lucide-react';

interface SettingsData {
  orgName: string;
  address: string;
  taxId: string;
  currency: string;
  timezone: string;
  notificationsEnabled: boolean;
}

interface SettingsViewProps {
  settings: SettingsData;
  setSettings: (settings: SettingsData) => void;
  onSave: () => void;
}

export default function SettingsView({
  settings,
  setSettings,
  onSave
}: SettingsViewProps) {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs space-y-6 max-w-3xl animate-fade-in transition-colors">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Corporate Station Preferences</h3>
        <p className="text-[10px] text-slate-500">Global tax identifiers, ERP baseline metrics, and notification thresholds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-bold text-slate-700 dark:text-slate-300">
        <div className="space-y-1.5">
          <label className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Registered Organization</label>
          <input
            type="text"
            value={settings.orgName}
            onChange={e => setSettings({ ...settings, orgName: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-[#5B3DF5] text-slate-800 dark:text-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Corporate Depot Address</label>
          <input
            type="text"
            value={settings.address}
            onChange={e => setSettings({ ...settings, address: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-[#5B3DF5] text-slate-800 dark:text-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Federal Tax ID Code</label>
          <input
            type="text"
            value={settings.taxId}
            onChange={e => setSettings({ ...settings, taxId: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-[#5B3DF5] text-slate-800 dark:text-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">System Base Currency</label>
          <select
            value={settings.currency}
            onChange={e => setSettings({ ...settings, currency: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-[#5B3DF5] text-slate-850 dark:text-white"
          >
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Operational Timezone</label>
          <select
            value={settings.timezone}
            onChange={e => setSettings({ ...settings, timezone: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-[#5B3DF5] text-slate-850 dark:text-white"
          >
            <option>UTC-6 (Central Standard Time)</option>
            <option>UTC-5 (Eastern Standard Time)</option>
            <option>UTC-8 (Pacific Standard Time)</option>
          </select>
        </div>
        <div className="flex items-center pt-5">
          <input
            type="checkbox"
            checked={settings.notificationsEnabled}
            onChange={e => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
            className="h-4.5 w-4.5 text-[#5B3DF5] rounded-md bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-0"
            id="notif_check_view"
          />
          <label htmlFor="notif_check_view" className="ml-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">Enable automated telemetry alerts & SMS notifications</label>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          onClick={onSave}
          className="px-4 py-2 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white rounded-lg text-xs font-bold uppercase shadow-md shadow-[#5B3DF5]/15 cursor-pointer transition-all"
        >
          Apply Preferences
        </button>
      </div>
    </div>
  );
}
