import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, Play, Settings, History, Server, Activity } from 'lucide-react';

interface LayoutProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.RUNNER, label: 'Job Runner', icon: Play },
    { id: AppView.HISTORY, label: 'Execution Logs', icon: History },
    { id: AppView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
          <div className="bg-sap-500 p-2 rounded-lg">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">DS Commander</h1>
            <p className="text-xs text-slate-400">SAP Data Services API</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-sap-600 text-white shadow-lg shadow-sap-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Activity className="w-3 h-3 text-green-500" />
                <span>System: Online</span>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 relative">
        <div className="max-w-6xl mx-auto space-y-6">
            {children}
        </div>
      </main>
    </div>
  );
};