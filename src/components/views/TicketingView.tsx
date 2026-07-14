"use client";

import React, { useState } from 'react';
import { Ticket, QrCode, TrendingUp, Users, Download, Activity, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function TicketingView() {
  const scanData = [
    { time: '16:00', scans: 450 },
    { time: '16:30', scans: 1200 },
    { time: '17:00', scans: 2800 },
    { time: '17:30', scans: 4500 },
    { time: '18:00', scans: 8900 },
    { time: '18:30', scans: 12400 },
    { time: '19:00', scans: 15242 },
  ];

  const ticketTypes = [
    { name: 'General Admission', count: 45000, scanned: 10500, color: '#3b82f6' },
    { name: 'Club Level', count: 12000, scanned: 3200, color: '#8b5cf6' },
    { name: 'VIP Suites', count: 3000, scanned: 1200, color: '#f59e0b' },
    { name: 'Student', count: 8000, scanned: 342, color: '#10b981' },
  ];

  return (
    <div className="flex flex-col h-full space-y-6 overflow-y-auto custom-scrollbar pb-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Ticketing & Ingress</h2>
          <p className="text-sm text-slate-400">Real-time scan rates, ticket validation, and attendance tracking.</p>
        </div>
        <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all text-sm">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 border-t-[3px] border-t-blue-500">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-400">Total Scanned</p>
            <div className="p-2 rounded bg-blue-500/20 text-blue-400">
              <QrCode size={16} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">15,242</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-400 font-medium">
            <TrendingUp size={14} />
            <span>+15% vs projected</span>
          </div>
        </div>

        <div className="glass-panel p-5 border-t-[3px] border-t-purple-500">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-400">Total Sold</p>
            <div className="p-2 rounded bg-purple-500/20 text-purple-400">
              <Ticket size={16} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">68,000</p>
          <p className="mt-2 text-xs text-slate-400">95% capacity</p>
        </div>

        <div className="glass-panel p-5 border-t-[3px] border-t-green-500">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-400">Scan Velocity</p>
            <div className="p-2 rounded bg-green-500/20 text-green-400">
              <Activity size={16} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">425</p>
          <p className="mt-2 text-xs text-slate-400">scans per minute</p>
        </div>

        <div className="glass-panel p-5 border-t-[3px] border-t-red-500">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-400">Invalid Scans</p>
            <div className="p-2 rounded bg-red-500/20 text-red-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">12</p>
          <p className="mt-2 text-xs text-slate-400">0.08% failure rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="glass-panel p-6 lg:col-span-2 flex flex-col min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-6">Cumulative Ingress Trajectory</h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scanData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown */}
        <div className="glass-panel p-6 flex flex-col min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-6">Ticket Categories</h3>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {ticketTypes.map((type, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-slate-200">{type.name}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">{type.scanned.toLocaleString()}</span>
                    <span className="text-xs text-slate-500"> / {type.count.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(type.scanned / type.count) * 100}%`, backgroundColor: type.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
