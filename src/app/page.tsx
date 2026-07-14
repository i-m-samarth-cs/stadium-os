"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { GateLoadWidget } from "@/components/widgets/GateLoadWidget";
import { ActiveIncidentsWidget } from "@/components/widgets/ActiveIncidentsWidget";
import { AIInsightsWidget } from "@/components/widgets/AIInsightsWidget";
import { CrowdChartWidget } from "@/components/widgets/CrowdChartWidget";
import { Bell, Search, UserCircle, Menu } from "lucide-react";

import { IncidentsView } from "@/components/views/IncidentsView";
import { GatesView } from "@/components/views/GatesView";
import { AITriageView } from "@/components/views/AITriageView";
import { TicketingView } from "@/components/views/TicketingView";
import { SettingsView } from "@/components/views/SettingsView";

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simple auth check
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Top Row KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[
                { label: "Total Inside", value: "15,242", sub: "+2,400 in last 30m", color: "text-blue-400" },
                { label: "Expected Attendance", value: "68,000", sub: "95% sold out", color: "text-slate-200" },
                { label: "Critical Incidents", value: "1", sub: "Security at Gate C", color: "text-red-400" },
                { label: "Copilot Confidence", value: "98%", sub: "System optimal", color: "text-indigo-400" },
              ].map((kpi, i) => (
                <div key={i} className="glass-panel p-5">
                  <p className="text-sm text-slate-400 mb-1">{kpi.label}</p>
                  <p className={`text-3xl font-bold tracking-tight mb-1 ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-xs text-slate-500">{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <div className="h-80">
                  <CrowdChartWidget />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-80">
                    <GateLoadWidget />
                  </div>
                  <div className="h-80">
                    <ActiveIncidentsWidget />
                  </div>
                </div>
              </div>
              
              <div className="h-full min-h-[500px]">
                <AIInsightsWidget />
              </div>
            </div>
          </>
        );
      case 'incidents':
        return <IncidentsView />;
      case 'gates':
        return <GatesView />;
      case 'ai':
        return <AITriageView />;
      case 'ticketing':
        return <TicketingView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <h2 className="text-2xl font-bold text-slate-300 mb-2 capitalize">{activeTab} View</h2>
            <p>This module is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <>
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 glass-panel border-t-0 border-x-0 rounded-none flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-slate-300 hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Command Center</h1>
              <p className="hidden md:block text-sm text-slate-400">Match Day: Nexus vs. Titans • Kickoff in 2h 15m</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search sectors, personnel..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all"
              />
            </div>
            
            <button className="relative text-slate-300 hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0b0f19]"></span>
            </button>
            
            <div className="flex items-center space-x-3 pl-4 lg:pl-6 border-l border-white/10 cursor-pointer">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-white">Commander Shepard</p>
                <p className="text-xs text-slate-400">Operations Lead</p>
              </div>
              <UserCircle size={36} className="text-slate-300" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      </main>
    </>
  );
}
