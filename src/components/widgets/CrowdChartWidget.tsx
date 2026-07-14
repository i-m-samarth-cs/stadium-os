"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const data = [
  { time: '17:00', load: 1200 },
  { time: '17:30', load: 2100 },
  { time: '18:00', load: 4500 },
  { time: '18:30', load: 8900 },
  { time: '19:00', load: 12400 },
  { time: '19:30', load: 15200 },
  { time: '20:00', load: 15800 },
];

export function CrowdChartWidget() {
  return (
    <div className="glass-panel p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Activity size={20} className="text-accent" />
        <h2 className="text-lg font-semibold text-white">Ingress Trajectory</h2>
      </div>

      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '8px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Area type="monotone" dataKey="load" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
