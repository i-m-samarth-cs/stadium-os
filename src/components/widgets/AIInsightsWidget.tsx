"use client";

import React, { useEffect, useState } from 'react';
import { BrainCircuit, CheckCircle2 } from 'lucide-react';
import { fetchDecisions } from '@/lib/api';

interface Decision {
  id: number;
  title: string;
  reason: string;
  confidence_level: string;
  recommendation: string;
}

export function AIInsightsWidget() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [executingId, setExecutingId] = useState<number | null>(null);

  useEffect(() => {
    fetchDecisions().then(data => {
      setDecisions(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleExecute = (id: number) => {
    setExecutingId(id);
    // Simulate API call for execution
    setTimeout(() => {
      setDecisions(prev => prev.filter(d => d.id !== id));
      setExecutingId(null);
    }, 1500);
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-full relative overflow-hidden">
      {/* Background glow for AI effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <BrainCircuit size={20} className="text-indigo-400" />
        <h2 className="text-lg font-semibold text-white">Copilot Triage</h2>
      </div>

      <div className="space-y-4 flex-1 relative z-10 overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="text-sm text-indigo-200/70">Analyzing datastreams...</div>
        ) : decisions.length === 0 ? (
          <div className="text-sm text-indigo-200/70">System optimal. No recommendations.</div>
        ) : decisions.map((dec) => (
          <div key={dec.id} className={`p-4 rounded-xl bg-indigo-500/10 border backdrop-blur-sm transition-all ${executingId === dec.id ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'border-indigo-500/20'}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-bold text-indigo-100">{dec.title}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {dec.confidence_level} Match
              </span>
            </div>
            <p className="text-xs text-indigo-200/70 mb-4 leading-relaxed">{dec.reason}</p>
            <button 
              onClick={() => handleExecute(dec.id)}
              disabled={executingId !== null}
              className={`w-full py-2 px-4 rounded-lg text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                executingId === dec.id 
                  ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)]'
              } ${executingId !== null && executingId !== dec.id ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <CheckCircle2 size={14} className={executingId === dec.id ? 'animate-pulse' : ''} />
              {executingId === dec.id ? 'Executing...' : dec.recommendation}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
