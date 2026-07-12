import React from 'react';
import { User, Shield, Terminal, Clock, Award, Star, Compass, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileViewProps {
  activeTripsCount: number;
}

export default function ProfileView({ activeTripsCount }: ProfileViewProps) {
  const { user } = useAuth();
  const isDriver = user?.role === 'Driver';

  if (isDriver) {
    return (
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs max-w-2xl space-y-6 animate-fade-in transition-colors">
        {/* Driver Header */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-[#5B3DF5] text-white font-extrabold text-2xl flex items-center justify-center uppercase shadow-lg shadow-[#5B3DF5]/15">
            AR
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Alex Rivera</h3>
            <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider mt-0.5">Professional Fleet Operator</p>
            <p className="text-[10px] text-slate-400 font-bold font-mono mt-0.5">Driver ID: #AR-9942-D</p>
          </div>
        </div>

        {/* Driver Details Grid */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-5 text-xs font-bold text-slate-600 dark:text-slate-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Primary Email Address</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 block">alex@transitops.com</span>
            </div>
            <div className="space-y-0.5">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">License Number / Category</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 block">CDL-A-9942 (CDL Class A)</span>
            </div>
            <div className="space-y-0.5">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">License Expiration</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 block">November 15, 2028</span>
            </div>
            <div className="space-y-0.5">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Safety Quality Score</span>
              <span className="font-semibold text-emerald-500 block">97 / 100 (Excellent)</span>
            </div>
            <div className="space-y-0.5">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Total Experience</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 block">8 Years Active Service</span>
            </div>
            <div className="space-y-0.5">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Logged Fuel Efficiency</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 block">6.8 MPG average</span>
            </div>
            <div className="space-y-0.5">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Assigned Machinery</span>
              <span className="font-semibold text-[#5B3DF5] block flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Volvo FH16 (AX-902-KL)</span>
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Completed Freight Trips</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 block">148 Transits</span>
            </div>
          </div>

          {/* Achievements block */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Driver Achievements & Badges</span>
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                ★ Safe Driver of the Month
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                ✦ Eco-Hauler Certified
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                ✔ Zero Incidents 2025
              </span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#5B3DF5]" />
              <span>Recent Activity Log</span>
            </h4>
            <div className="space-y-3 font-mono text-[10px] text-slate-500 leading-relaxed font-bold">
              <div className="flex space-x-2">
                <span className="text-emerald-500">[COMPLETED]</span>
                <span>Finished transit cargo route Chicago, IL to St. Louis, MO (TR-8942) successfully.</span>
              </div>
              <div className="flex space-x-2">
                <span className="text-blue-500">[FUEL_LOG]</span>
                <span>Logged fuel volume at Pilot Center Denver (145 gallons).</span>
              </div>
              <div className="flex space-x-2">
                <span className="text-indigo-500">[CHECK]</span>
                <span>Pre-trip mechanical safety inspect and brake checks approved.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Profile View (James Donovan)
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs max-w-2xl space-y-6 animate-fade-in transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-[#5B3DF5] text-white font-extrabold text-2xl flex items-center justify-center uppercase shadow-lg shadow-[#5B3DF5]/15">
          JD
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">James Donovan</h3>
          <p className="text-[10px] uppercase font-bold text-[#7C5CFC] tracking-wider mt-0.5">Fleet Operations Director</p>
          <p className="text-[10px] text-slate-400 font-bold font-mono mt-0.5">Terminal ID: #7985-T</p>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-5 text-xs font-bold text-slate-600 dark:text-slate-300">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Primary Email Address</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200 block">james.donovan@transitops.com</span>
          </div>
          <div className="space-y-0.5">
            <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Clearance Clearance</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200 block">Global Master Administrator</span>
          </div>
          <div className="space-y-0.5">
            <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Terminal Access Key</span>
            <span className="font-mono text-slate-500 block">TLS_OP_9942_AES</span>
          </div>
          <div className="space-y-0.5">
            <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Terminal Last Sign-In</span>
            <span className="text-slate-500 block">July 11, 2026 - 21:52:56</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#5B3DF5]" />
            <span>Terminal Operational Timeline</span>
          </h4>
          <div className="space-y-3 font-mono text-[10px] text-slate-500 leading-relaxed font-bold">
            <div className="flex space-x-2">
              <span className="text-emerald-500">[ONLINE]</span>
              <span>Authorized secure login verified via local corporate active proxy node.</span>
            </div>
            <div className="flex space-x-2">
              <span className="text-blue-500">[MUTATE]</span>
              <span>Dispatched heavy transit route Volvo FH16 asset registry.</span>
            </div>
            <div className="flex space-x-2">
              <span className="text-amber-500">[CONFIG]</span>
              <span>Applied workstation tax identification configurations link.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
