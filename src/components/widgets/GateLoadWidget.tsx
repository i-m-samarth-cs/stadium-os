"use client";

import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchGates } from '@/lib/api';

interface Gate {
  name: string;
  current_load: number;
  status: string;
}

export function GateLoadWidget() {
  const [gates, setGates] = useState<Gate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGates().then(data => {
      setGates(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="glass-panel p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Users size={20} className="text-primary" />
          Live Gate Load
        </h2>
        <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-1 rounded border border-primary/30">Live</span>
      </div>

      <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="text-sm text-slate-400">Loading gates...</div>
        ) : gates.length === 0 ? (
          <div className="text-sm text-slate-400">No gates active.</div>
        ) : gates.map((gate, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={cn("font-medium", gate.status === "congested" ? "text-red-400" : "text-slate-200")}>{gate.name}</span>
              <span className={cn("font-bold", gate.status === "congested" ? "text-red-400" : "text-slate-300")}>{gate.current_load}%</span>
            </div>
            <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-in-out",
                  gate.status === "congested" ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : 
                  gate.current_load > 70 ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" : 
                  "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                )}
                style={{ width: `${gate.current_load}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
