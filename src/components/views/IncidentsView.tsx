"use client";

import React, { useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, ShieldAlert, Search, Filter, Plus } from 'lucide-react';
import { fetchActiveIncidents } from '@/lib/api';

interface Incident {
  id: number;
  type: string;
  severity: string;
  location: string;
  description: string;
  created_at: string;
  status: string;
}

export function IncidentsView() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveIncidents().then(data => {
      setIncidents(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1"><ShieldAlert size={12}/> Critical</span>;
      case 'high':
        return <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold flex items-center gap-1"><AlertCircle size={12}/> High</span>;
      default:
        return <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1"><AlertTriangle size={12}/> Medium</span>;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Incident Management</h2>
          <p className="text-sm text-slate-400">Monitor and resolve stadium issues in real-time.</p>
        </div>
        <button className="bg-primary hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center gap-2 transition-all">
          <Plus size={18} />
          Report Incident
        </button>
      </div>

      <div className="glass-panel p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search incidents by ID, location, or description..." 
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="glass-panel overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-400 text-sm">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Severity</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium">Time Reported</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading incidents...</td>
                </tr>
              ) : incidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No active incidents found.</td>
                </tr>
              ) : (
                incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="p-4 text-sm font-medium text-slate-300 group-hover:text-white">INC-{inc.id.toString().padStart(4, '0')}</td>
                    <td className="p-4 text-sm text-slate-300">{inc.type}</td>
                    <td className="p-4">{getSeverityBadge(inc.severity)}</td>
                    <td className="p-4 text-sm text-slate-300">{inc.location}</td>
                    <td className="p-4 text-sm text-slate-400 truncate max-w-xs">{inc.description}</td>
                    <td className="p-4 text-sm text-slate-400">{new Date(inc.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold capitalize">
                        {inc.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
