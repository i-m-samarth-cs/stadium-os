"use client";

import React, { useState, useEffect } from 'react';
import { QrCode, MapPin, Clock, AlertTriangle, ShieldCheck, MessageSquare, Ticket, ArrowRight, User } from 'lucide-react';
import { fetchGates } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Gate {
  id: number;
  name: string;
  current_load: number;
  status: string;
}

// Mock Fan Database
const FAN_DATA: Record<string, any> = {
  'TIX-001': {
    name: 'Alex',
    section: '114',
    row: 'G',
    seat: '12',
    gate: 'VIP Entrance',
    messages: [
      { time: '7:45 PM', text: 'Welcome to Nexus Arena, Alex! Enjoy the game.' },
      { time: '7:50 PM', text: 'Your recommended entry is the VIP Entrance. Current wait time is under 5 mins.' }
    ]
  },
  'TIX-002': {
    name: 'Sarah',
    section: '202',
    row: 'A',
    seat: '4',
    gate: 'Gate A (North)',
    messages: [
      { time: '7:30 PM', text: 'Welcome to Nexus Arena, Sarah!' },
      { time: '7:55 PM', text: 'Alert: Gate A is experiencing high traffic. You may use Gate B for faster entry.' }
    ]
  },
  'TIX-003': {
    name: 'Jordan',
    section: '415',
    row: 'Z',
    seat: '22',
    gate: 'Gate C (South)',
    messages: [
      { time: '7:00 PM', text: 'Gates are now open! Welcome to Nexus Arena.' },
      { time: '7:40 PM', text: 'Alert: Heavy congestion at Gate C. Please consider Gate B.' }
    ]
  }
};

export default function FanPortal() {
  const [gates, setGates] = useState<Gate[]>([]);
  const [incidentReported, setIncidentReported] = useState(false);
  
  // Login State
  const [ticketInput, setTicketInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [fan, setFan] = useState<any>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'ticket' | 'map' | 'messages'>('ticket');

  useEffect(() => {
    fetchGates().then(data => setGates(data)).catch(console.error);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedInput = ticketInput.toUpperCase().trim();
    const fanData = FAN_DATA[formattedInput] || FAN_DATA[`TIX-${formattedInput}`]; // allow entering just '001'
    
    if (fanData) {
      setFan(fanData);
      setLoginError('');
    } else {
      setLoginError('Invalid Ticket Number. Try TIX-001, TIX-002, or TIX-003.');
    }
  };

  const handleReportIncident = () => {
    setIncidentReported(true);
    setTimeout(() => setIncidentReported(false), 3000);
  };

  // --- LOGIN SCREEN ---
  if (!fan) {
    return (
      <div className="min-h-screen w-full flex-1 flex items-center justify-center bg-[#0f172a] text-slate-200 p-6 font-sans">
        <div className="w-full max-w-sm bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-500 mx-auto flex items-center justify-center mb-4">
              <Ticket size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Fan Portal</h1>
            <p className="text-sm text-slate-400">Access your digital ticket and live stadium updates.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg">{loginError}</p>}
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ticket Number</label>
              <input 
                type="text" 
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                placeholder="e.g. TIX-001"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              Access Ticket <ArrowRight size={18} />
            </button>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Demo Tickets:</p>
              <div className="flex gap-2 justify-center">
                <button type="button" onClick={() => setTicketInput('TIX-001')} className="px-3 py-1 bg-slate-700 rounded-md text-xs hover:bg-slate-600">TIX-001</button>
                <button type="button" onClick={() => setTicketInput('TIX-002')} className="px-3 py-1 bg-slate-700 rounded-md text-xs hover:bg-slate-600">TIX-002</button>
                <button type="button" onClick={() => setTicketInput('TIX-003')} className="px-3 py-1 bg-slate-700 rounded-md text-xs hover:bg-slate-600">TIX-003</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- APP SCREEN ---
  return (
    <div className="min-h-screen w-full flex-1 bg-[#0f172a] text-slate-200 pb-24 font-sans flex flex-col" aria-label="Fan Portal">
      {/* Header */}
      <header className="bg-blue-600 px-6 py-8 rounded-b-3xl shadow-lg relative overflow-hidden shrink-0" role="banner">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <h1 className="text-2xl font-bold text-white mb-1 flex justify-between items-center">
          <span>Welcome, {fan.name}!</span>
          <button onClick={() => setFan(null)} className="text-blue-200 hover:text-white"><User size={20} /></button>
        </h1>
        <p className="text-blue-100 text-sm">Nexus vs. Titans • 8:00 PM</p>
      </header>

      <main className="px-4 -mt-6 relative z-10 flex-1 overflow-y-auto" role="main">
        {/* TICKET TAB */}
        {activeTab === 'ticket' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <section className="bg-white text-slate-800 rounded-2xl p-6 shadow-xl" aria-labelledby="ticket-heading">
              <h2 id="ticket-heading" className="sr-only">Your Ticket</h2>
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Section</p>
                  <p className="text-2xl font-bold text-blue-600">{fan.section}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider text-center">Row</p>
                  <p className="text-2xl font-bold text-blue-600 text-center">{fan.row}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Seat</p>
                  <p className="text-2xl font-bold text-blue-600">{fan.seat}</p>
                </div>
              </div>
              <div className="flex justify-center py-4 relative">
                <QrCode size={160} className="text-slate-800" aria-label="QR Code for Ticket Entry" />
                {/* Simulated laser scan line */}
                <div className="absolute top-4 w-full max-w-[160px] h-1 bg-blue-500/50 shadow-[0_0_10px_#3b82f6] animate-[scan_2s_ease-in-out_infinite]" />
              </div>
              <div className="text-center mt-2">
                <p className="text-sm font-bold text-slate-700">Recommended: {fan.gate}</p>
                <p className="text-xs text-slate-400 mt-1">Scan at any turnstile for entry</p>
              </div>
            </section>

            <section aria-labelledby="gates-heading">
              <h2 id="gates-heading" className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Clock size={18} className="text-blue-400" />
                Live Gate Wait Times
              </h2>
              <div className="space-y-3">
                {gates.length === 0 ? (
                  <div className="bg-slate-800 p-4 rounded-xl text-center text-sm text-slate-400">Loading gates...</div>
                ) : gates.map(gate => {
                  const waitTime = Math.round((gate.current_load / 100) * 45);
                  let colorClass = "text-green-400";
                  if (waitTime > 15) colorClass = "text-amber-400";
                  if (waitTime > 30) colorClass = "text-red-400";

                  const isRecommended = gate.name.includes(fan.gate) || fan.gate.includes(gate.name);

                  return (
                    <div key={gate.id} className={`bg-slate-800/80 border ${isRecommended ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-slate-700'} p-4 rounded-xl flex justify-between items-center`}>
                      <div>
                        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                          {gate.name}
                          {isRecommended && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase">Your Gate</span>}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 capitalize">
                          <MapPin size={12} /> {gate.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${colorClass}`}>{waitTime}m</p>
                        <p className="text-xs text-slate-400">Wait</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === 'map' && (
          <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold text-white">Stadium Map</h2>
            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 aspect-square flex items-center justify-center relative overflow-hidden">
               <svg viewBox="0 0 400 400" className="w-full h-full opacity-90">
                <rect x="125" y="100" width="150" height="200" rx="20" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <path d="M 100,50 Q 200,-20 300,50 L 320,80 Q 380,200 320,320 L 300,350 Q 200,420 100,350 L 80,320 Q 20,200 80,80 Z" fill="none" stroke="#334155" strokeWidth="30" />
                
                {/* User's Section Highlight */}
                <circle cx="200" cy="50" r="10" fill="#3b82f6" className="animate-pulse" />
                <text x="200" y="30" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">Sec {fan.section}</text>

                {/* Gate Highlight */}
                <rect x="180" y="360" width="40" height="10" fill="#10b981" />
                <text x="200" y="385" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle">{fan.gate}</text>
               </svg>
            </div>
            
            <section aria-labelledby="help-heading">
              <h2 id="help-heading" className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-400" />
                Need Assistance?
              </h2>
              <button 
                onClick={handleReportIncident}
                className="w-full bg-red-500/10 border border-red-500/30 text-red-400 py-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
                aria-live="polite"
              >
                {incidentReported ? (
                  <>
                    <ShieldCheck size={24} className="text-green-400" />
                    <span className="font-medium text-green-400">Security Dispatched</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={24} />
                    <span className="font-medium">Report Incident near Sec {fan.section}</span>
                  </>
                )}
              </button>
            </section>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            {fan.messages.map((msg: any, i: number) => (
              <div key={i} className={`p-4 rounded-xl border ${msg.text.includes('Alert') ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{msg.time}</span>
                  {msg.text.includes('Alert') && <AlertTriangle size={14} className="text-red-400" />}
                </div>
                <p className="text-sm text-slate-200">{msg.text}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-3 pb-safe z-50" aria-label="Mobile Navigation">
        <button 
          onClick={() => setActiveTab('ticket')}
          className={cn("flex flex-col items-center gap-1 transition-colors w-20", activeTab === 'ticket' ? "text-blue-500" : "text-slate-500 hover:text-slate-300")}
        >
          <QrCode size={20} />
          <span className="text-[10px] font-medium">Ticket</span>
        </button>
        <button 
          onClick={() => setActiveTab('map')}
          className={cn("flex flex-col items-center gap-1 transition-colors w-20", activeTab === 'map' ? "text-blue-500" : "text-slate-500 hover:text-slate-300")}
        >
          <MapPin size={20} />
          <span className="text-[10px] font-medium">Map</span>
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className={cn("flex flex-col items-center gap-1 transition-colors w-20", activeTab === 'messages' ? "text-blue-500" : "text-slate-500 hover:text-slate-300")}
        >
          <MessageSquare size={20} />
          <span className="text-[10px] font-medium">Messages</span>
        </button>
      </nav>

      {/* Adding a simple scan animation keyframe */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(140px); opacity: 0; }
        }
      `}} />
    </div>
  );
}
