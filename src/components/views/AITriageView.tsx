"use client";

import React, { useEffect, useState } from 'react';
import { BrainCircuit, CheckCircle2, History, Activity, Zap } from 'lucide-react';
import { fetchDecisions } from '@/lib/api';

interface Decision {
  id: number;
  title: string;
  reason: string;
  confidence_level: string;
  recommendation: string;
  timestamp: string;
}

export function AITriageView() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [executingId, setExecutingId] = useState<number | null>(null);
  const [history, setHistory] = useState<Decision[]>([]);

  useEffect(() => {
    fetchDecisions().then(data => {
      setDecisions(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleExecute = (dec: Decision) => {
    setExecutingId(dec.id);
    setTimeout(() => {
      setDecisions(prev => prev.filter(d => d.id !== dec.id));
      setHistory(prev => [dec, ...prev]);
      setExecutingId(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-1 flex items-center gap-2">
            <BrainCircuit className="text-indigo-400" />
            AI Intelligence & Triage
          </h2>
          <p className="text-sm text-slate-400">Copilot neural network analyzing stadium datastreams in real-time.</p>
        </div>
        <div className="flex items-center gap-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-300">SYSTEM NOMINAL</span>
          </div>
          <div className="h-4 w-px bg-indigo-500/30" />
          <span className="text-xs text-indigo-200/70">1.2B data points/sec</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-6 flex-1 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Zap size={18} className="text-indigo-400" />
              Active Recommendations
            </h3>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {loading ? (
                <div className="text-center p-12 text-indigo-200/70">Initializing neural pathways...</div>
              ) : decisions.length === 0 ? (
                <div className="text-center p-12 text-indigo-200/70 border border-dashed border-indigo-500/20 rounded-xl bg-indigo-500/5">
                  System optimal. No current recommendations.
                </div>
              ) : decisions.map((dec) => (
                <div key={dec.id} className={`p-5 rounded-xl bg-indigo-500/10 border backdrop-blur-sm transition-all ${executingId === dec.id ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'border-indigo-500/30 hover:bg-indigo-500/20'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-bold text-indigo-100">{dec.title}</h4>
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-500/50 font-medium">
                      {dec.confidence_level} Confidence
                    </span>
                  </div>
                  <p className="text-sm text-indigo-200/80 mb-5 leading-relaxed">{dec.reason}</p>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleExecute(dec)}
                      disabled={executingId !== null}
                      className={`flex-1 py-3 px-4 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                        executingId === dec.id 
                          ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                          : 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)]'
                      } ${executingId !== null && executingId !== dec.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <CheckCircle2 size={16} className={executingId === dec.id ? 'animate-pulse' : ''} />
                      {executingId === dec.id ? 'Executing Subroutine...' : dec.recommendation}
                    </button>
                    <button className="px-4 py-3 text-sm text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 transition-all font-medium">
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <History size={18} className="text-slate-400" />
            Execution Log
          </h3>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {history.length === 0 ? (
              <div className="text-center p-8 text-sm text-slate-500">No actions executed in this session.</div>
            ) : history.map((hist, i) => (
              <div key={i} className="flex gap-3 relative">
                {/* Timeline line */}
                {i !== history.length - 1 && <div className="absolute left-2.5 top-6 bottom-[-16px] w-px bg-slate-700"></div>}
                
                <div className="mt-1">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center z-10 relative">
                    <CheckCircle2 size={10} className="text-green-400" />
                  </div>
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-sm font-medium text-slate-200">{hist.recommendation}</p>
                  <p className="text-xs text-slate-500 mt-1">Executed for: {hist.title}</p>
                  <p className="text-xs text-slate-600 mt-1">Just now</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
