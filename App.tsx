import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SettingsPanel } from './components/SettingsPanel';
import { JobRunner } from './components/JobRunner';
import { HistoryLog } from './components/HistoryLog';
import { Dashboard } from './components/Dashboard';
import { AppView, ServerConfig, ExecutionLog } from './types';

const DEFAULT_CONFIG: ServerConfig = {
  baseUrl: 'https://api.example.sap-ds.com/DataServices/servlet/rest',
  cmsSystem: 'localhost:6400',
  username: 'Administrator',
  password: '',
  authType: 'Basic'
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [config, setConfig] = useState<ServerConfig>(DEFAULT_CONFIG);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);

  // Load from local storage on mount (Mock persistence)
  useEffect(() => {
    const savedConfig = localStorage.getItem('sap_ds_config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) { console.error("Failed to load config"); }
    }
  }, []);

  const handleSaveConfig = (newConfig: ServerConfig) => {
    setConfig(newConfig);
    localStorage.setItem('sap_ds_config', JSON.stringify(newConfig));
  };

  const handleJobExecute = (log: ExecutionLog) => {
    setLogs(prev => [log, ...prev]);
    if (log.status === 'Success') {
        // Optional: show toast notification
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.SETTINGS:
        return <SettingsPanel config={config} onSave={handleSaveConfig} />;
      case AppView.RUNNER:
        return <JobRunner serverConfig={config} onExecute={handleJobExecute} />;
      case AppView.HISTORY:
        return <HistoryLog logs={logs} />;
      case AppView.DASHBOARD:
      default:
        return <Dashboard logs={logs} onQuickRun={() => setCurrentView(AppView.RUNNER)} />;
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;