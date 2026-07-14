"use client";

import React, { useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchActiveIncidents } from '@/lib/api';

interface Incident {
  id: number;
  type: string;
  severity: string;
  location: string;
  description: string;
  created_at: string;
}

export function ActiveIncidentsWidget() {
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

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldAlert size={18} className="text-red-500" />;
      case 'high': return <AlertCircle size={18} className="text-orange-500" />;
      default: return <AlertTriangle size={18} className="text-amber-500" />;
    }
  };

  const formatTime = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
    return `${diff}m ago`;
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Active Incidents</h2>
        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30">
          {incidents.length} Active
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-sm text-slate-400">Loading incidents...</div>
        ) : incidents.length === 0 ? (
          <div className="text-sm text-slate-400">No active incidents.</div>
        ) : incidents.map((inc) => (
          <div 
            key={inc.id} 
            className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="mt-0.5">{getIcon(inc.severity)}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-200">{inc.type}</span>
                <span className="text-xs text-slate-400">{formatTime(inc.created_at)}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{inc.location} - {inc.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
