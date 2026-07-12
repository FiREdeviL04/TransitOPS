import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign, Wrench } from 'lucide-react';

export interface NotificationItem {
  id: string;
  category: 'alert' | 'logistics' | 'expense' | 'safety' | 'maintenance';
  title: string;
  message: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClearAll
}: NotificationDrawerProps) {
  // Helpers
  const getIcon = (category: string) => {
    switch (category) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'expense':
        return <DollarSign className="w-4 h-4 text-[#EF4444] shrink-0" />;
      case 'safety':
        return <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-blue-500 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-[#EF4444]';
      case 'medium':
        return 'border-l-4 border-l-amber-500';
      default:
        return 'border-l-4 border-l-slate-200 dark:border-l-slate-700';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 transition-opacity" 
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-[#1E293B] shadow-2xl z-50 border-l border-slate-100 dark:border-slate-800 flex flex-col text-xs transition-colors duration-200"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-[#5B3DF5]" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Operations Log Alerts
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444] text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions toolbar */}
            {notifications.length > 0 && (
              <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1E293B] flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <button 
                  onClick={onMarkAllRead}
                  className="text-[#5B3DF5] hover:underline flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
                <button 
                  onClick={onClearAll}
                  className="text-rose-500 hover:underline flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear logs</span>
                </button>
              </div>
            )}

            {/* Notification items listing */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10">
              {notifications.length > 0 ? (
                notifications.map(item => (
                  <div
                    key={item.id}
                    className={`p-4 bg-white dark:bg-[#1E293B] transition-colors relative flex space-x-3 hover:bg-slate-50/50 dark:hover:bg-slate-850 ${getPriorityColor(item.priority)} ${!item.read ? 'bg-indigo-50/20 dark:bg-indigo-900/10' : ''}`}
                  >
                    <div className="pt-0.5">
                      {getIcon(item.category)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className={`font-bold ${!item.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                          {item.title}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                        {item.message}
                      </p>
                      
                      {!item.read && (
                        <button
                          onClick={() => onMarkRead(item.id)}
                          className="text-[9px] text-[#5B3DF5] hover:underline font-bold uppercase tracking-wider block mt-1"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500 space-y-2">
                  <Bell className="w-10 h-10 opacity-30" />
                  <p className="font-bold uppercase tracking-wider text-xs">No active alerts</p>
                  <p className="text-[10px]">All operations logs are fully cleared</p>
                </div>
              )}
            </div>

            {/* Bottom operational status bar */}
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/30 flex justify-between items-center uppercase font-[Poppins]">
              <span>Cluster Node #24B</span>
              <span className="text-green-500 font-bold">● Active Online</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
