"use client";

import React, { useEffect, useState } from 'react';
import { Users, AlertTriangle, ArrowUpRight, ArrowDownRight, Map } from 'lucide-react';
import { fetchGates } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Gate {
  id: number;
  name: string;
  current_load: number;
  status: string;
}

export function GatesView() {
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

  const getStatusColor = (status: string, load: number) => {
    if (status === 'congested' || load > 85) return 'text-red-400 bg-red-500/20 border-red-500/30';
    if (load > 60) return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    return 'text-green-400 bg-green-500/20 border-green-500/30';
  };

  const getProgressBarColor = (status: string, load: number) => {
    if (status === 'congested' || load > 85) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]';
    if (load > 60) return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]';
    return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]';
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Gates & Routes</h2>
          <p className="text-sm text-slate-400">Manage ingress flow and alleviate congestion across all access points.</p>
        </div>
        <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all" aria-label="Toggle Fullscreen Map">
          <Map size={18} />
          Toggle Fullscreen Map
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
        {/* Interactive SVG Stadium Map */}
        <div className="xl:w-2/3 glass-panel p-6 flex flex-col relative overflow-hidden" aria-label="Interactive Stadium Map">
          <h3 className="text-lg font-semibold text-white mb-4">Live Stadium Heatmap</h3>
          <div className="flex-1 min-h-[400px] flex items-center justify-center bg-[#0b0f19] rounded-xl border border-white/5 relative overflow-hidden">
            {/* Minimal SVG Stadium Representation */}
            <svg viewBox="0 0 800 600" className="w-full h-full max-w-2xl opacity-80" aria-label="Stadium Floor Plan">
              {/* Pitch */}
              <rect x="250" y="200" width="300" height="200" rx="20" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="2" />
              <circle cx="400" cy="300" r="30" fill="none" stroke="#10b981" strokeWidth="2" />
              <line x1="400" y1="200" x2="400" y2="400" stroke="#10b981" strokeWidth="2" />
              
              {/* Stands */}
              <path d="M 200,150 Q 400,50 600,150 L 650,200 Q 750,300 650,400 L 600,450 Q 400,550 200,450 L 150,400 Q 50,300 150,200 Z" fill="none" stroke="#334155" strokeWidth="40" />
              <path d="M 150,100 Q 400,-20 650,100 L 720,170 Q 850,300 720,430 L 650,500 Q 400,620 150,500 L 80,430 Q -50,300 80,170 Z" fill="none" stroke="#1e293b" strokeWidth="40" />
              
              {/* Dynamic Gate Nodes mapped from data */}
              {gates.map((gate, i) => {
                // Approximate positions around the stadium oval
                const positions = [
                  { cx: 400, cy: 60 },  // North (Gate A)
                  { cx: 700, cy: 300 }, // East (Gate B)
                  { cx: 400, cy: 540 }, // South (Gate C)
                  { cx: 100, cy: 300 }  // West / VIP
                ];
                const pos = positions[i % positions.length];
                let color = "#34d399"; // Green
                let glowColor = "rgba(52, 211, 153, 0.4)";
                
                if (gate.status === 'congested' || gate.current_load > 85) {
                  color = "#f87171"; // Red
                  glowColor = "rgba(248, 113, 113, 0.6)";
                } else if (gate.current_load > 60) {
                  color = "#fbbf24"; // Amber
                  glowColor = "rgba(251, 191, 36, 0.4)";
                }

                return (
                  <g key={gate.id} className="cursor-pointer hover:opacity-80 transition-all">
                    <circle cx={pos.cx} cy={pos.cy} r="25" fill={glowColor} className="animate-pulse" />
                    <circle cx={pos.cx} cy={pos.cy} r="12" fill={color} />
                    <text x={pos.cx} y={pos.cy - 35} fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" className="drop-shadow-md">{gate.name}</text>
                    <text x={pos.cx} y={pos.cy + 35} fill={color} fontSize="12" fontWeight="bold" textAnchor="middle">{gate.current_load}%</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Gates List */}
        <div className="xl:w-1/3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2" aria-label="Gates List">
          {loading ? (
            <div className="text-slate-400 p-8 text-center glass-panel">Loading gates data...</div>
          ) : gates.length === 0 ? (
            <div className="text-slate-400 p-8 text-center glass-panel">No gates data available.</div>
          ) : (
            gates.map((gate) => (
              <div key={gate.id} className="glass-panel p-5 flex flex-col relative overflow-hidden group border-l-4" style={{
                borderLeftColor: gate.status === 'congested' || gate.current_load > 85 ? '#ef4444' : gate.current_load > 60 ? '#f59e0b' : '#10b981'
              }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-md font-bold text-white">{gate.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Users size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-400">Cap: 15k/hr</span>
                    </div>
                  </div>
                  <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase border", getStatusColor(gate.status, gate.current_load))}>
                    {gate.status}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-xs text-slate-300 font-medium">Load</span>
                    <span className="text-sm font-bold text-white">{gate.current_load}%</span>
                  </div>
                  
                  <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-in-out",
                        getProgressBarColor(gate.status, gate.current_load)
                      )}
                      style={{ width: `${gate.current_load}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
