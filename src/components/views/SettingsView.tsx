"use client";

import React, { useState } from 'react';
import { User, Bell, Shield, Database, Smartphone, Check, Moon, Sun, Monitor, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Toggles State
  const [toggles, setToggles] = useState({
    autoExecute: false,
    sensoryAnalysis: true,
    pushNotifs: true,
    emailNotifs: false,
    smsNotifs: true,
    twoFactor: true,
    ssoLogin: false,
    auditLogging: true
  });

  const toggleSetting = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile & Account' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security & Access' },
    { id: 'system', icon: Database, label: 'System Preferences' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Full Name</label>
                <input type="text" defaultValue="Command Center Admin" className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Email Address</label>
                <input type="email" defaultValue="admin@stadiumos.com" className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Role</label>
                <input type="text" defaultValue="System Administrator" disabled className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-slate-500 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Department</label>
                <input type="text" defaultValue="Command Center" disabled className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-slate-500 cursor-not-allowed" />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-all">Save Changes</button>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Alert Channels</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-white font-medium">Push Notifications</h4>
                    <p className="text-sm text-slate-400">Receive critical alerts directly in your browser</p>
                  </div>
                  <div onClick={() => toggleSetting('pushNotifs')} className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", toggles.pushNotifs ? "bg-blue-600" : "bg-slate-700")}>
                    <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", toggles.pushNotifs ? "left-7" : "left-1")}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-white font-medium">Email Alerts</h4>
                    <p className="text-sm text-slate-400">Daily summaries and high-severity incident reports</p>
                  </div>
                  <div onClick={() => toggleSetting('emailNotifs')} className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", toggles.emailNotifs ? "bg-blue-600" : "bg-slate-700")}>
                    <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", toggles.emailNotifs ? "left-7" : "left-1")}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-white font-medium">SMS Emergency Paging</h4>
                    <p className="text-sm text-slate-400">Immediate text messages for critical facility emergencies</p>
                  </div>
                  <div onClick={() => toggleSetting('smsNotifs')} className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", toggles.smsNotifs ? "bg-blue-600" : "bg-slate-700")}>
                    <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", toggles.smsNotifs ? "left-7" : "left-1")}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end border-t border-white/10">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-all">Update Preferences</button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8">
            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex items-start gap-4">
              <Shield className="text-blue-400 mt-1 shrink-0" size={24} />
              <div>
                <h4 className="text-blue-400 font-bold">System Administrator Access Granted</h4>
                <p className="text-sm text-blue-200 mt-1">You are logged in with elevated privileges. You have full control over the stadium's access management and security parameters.</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Authentication Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-white font-medium">Two-Factor Authentication (2FA)</h4>
                    <p className="text-sm text-slate-400">Require biometric or authenticator app approval on login</p>
                  </div>
                  <div onClick={() => toggleSetting('twoFactor')} className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", toggles.twoFactor ? "bg-green-500" : "bg-slate-700")}>
                    <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", toggles.twoFactor ? "left-7" : "left-1")}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-white font-medium">Single Sign-On (SSO)</h4>
                    <p className="text-sm text-slate-400">Allow staff to authenticate via corporate Identity Provider</p>
                  </div>
                  <div onClick={() => toggleSetting('ssoLogin')} className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", toggles.ssoLogin ? "bg-green-500" : "bg-slate-700")}>
                    <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", toggles.ssoLogin ? "left-7" : "left-1")}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-white font-medium">Strict Audit Logging</h4>
                    <p className="text-sm text-slate-400">Log all API requests, data mutations, and AI evaluations</p>
                  </div>
                  <div onClick={() => toggleSetting('auditLogging')} className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", toggles.auditLogging ? "bg-green-500" : "bg-slate-700")}>
                    <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", toggles.auditLogging ? "left-7" : "left-1")}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end border-t border-white/10">
              <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 px-6 py-2 rounded-lg font-medium transition-all">Revoke All Active Sessions</button>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
              <div className="grid grid-cols-3 gap-4">
                <button className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-blue-500 bg-blue-500/10 text-white">
                  <Moon size={24} className="mb-2 text-blue-400" />
                  <span className="text-sm font-medium">Dark Mode</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                  <Sun size={24} className="mb-2" />
                  <span className="text-sm font-medium">Light Mode</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                  <Monitor size={24} className="mb-2" />
                  <span className="text-sm font-medium">System Auto</span>
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h3 className="text-lg font-semibold text-white mb-4">AI Copilot Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-white font-medium">Auto-Execute High Confidence Actions</h4>
                    <p className="text-sm text-slate-400">Allow Copilot to automatically execute decisions with &gt;95% confidence</p>
                  </div>
                  <div onClick={() => toggleSetting('autoExecute')} className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", toggles.autoExecute ? "bg-blue-600" : "bg-slate-700")}>
                    <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", toggles.autoExecute ? "left-7" : "left-1")}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                  <div>
                    <h4 className="text-white font-medium">Enhanced NVIDIA NIM Integration</h4>
                    <p className="text-sm text-slate-400">Use meta/llama-3.1-8b-instruct for deep inference on stadium datastreams</p>
                  </div>
                  <div onClick={() => toggleSetting('sensoryAnalysis')} className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", toggles.sensoryAnalysis ? "bg-blue-600" : "bg-slate-700")}>
                    <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", toggles.sensoryAnalysis ? "left-7" : "left-1")}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Settings & Preferences</h2>
          <p className="text-sm text-slate-400">Manage your account, notifications, and system configurations.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className="lg:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex-1 glass-panel p-8 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
