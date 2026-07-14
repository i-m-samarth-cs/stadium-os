import React from 'react';
import { LayoutDashboard, AlertTriangle, MapPin, Brain, Settings, Ticket, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ className, activeTab, onTabChange, isOpen, onClose, ...props }: SidebarProps) {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: AlertTriangle, label: 'Incidents', id: 'incidents' },
    { icon: MapPin, label: 'Gates & Routes', id: 'gates' },
    { icon: Brain, label: 'AI Intelligence', id: 'ai' },
    { icon: Ticket, label: 'Ticketing', id: 'ticketing' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 glass-panel rounded-none border-t-0 border-l-0 border-b-0 flex flex-col pt-6 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )} 
        {...props}
      >
        <div className="px-6 mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]">
              S
            </div>
            <h1 className="text-xl font-bold tracking-wider text-white">StadiumOS</h1>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                activeTab === item.id
                  ? "bg-primary/20 text-primary border border-primary/30 shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-md">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs font-semibold text-indigo-300">SYSTEM ONLINE</span>
            </div>
            <p className="text-xs text-slate-300">Copilot AI is monitoring all sectors.</p>
          </div>
        </div>
      </div>
    </>
  );
}
