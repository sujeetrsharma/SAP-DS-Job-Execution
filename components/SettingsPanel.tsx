import React, { useState, useEffect } from 'react';
import { ServerConfig } from '../types';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SettingsPanelProps {
  config: ServerConfig;
  onSave: (config: ServerConfig) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onSave }) => {
  const [formData, setFormData] = useState<ServerConfig>(config);
  const [status, setStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setStatus('idle');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Connection Settings</h2>
          <p className="text-sm text-gray-500">Configure your SAP Data Services REST API endpoint.</p>
        </div>
        {status === 'saved' && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm animate-fade-in-up">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Base API URL</label>
            <div className="relative">
              <input
                type="url"
                name="baseUrl"
                required
                value={formData.baseUrl}
                onChange={handleChange}
                placeholder="https://myserver:8443/DataServices/servlet/rest"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sap-500 focus:border-sap-500 outline-none transition-all"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">The root URL for your DS web services/REST wrapper.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CMS System</label>
            <input
              type="text"
              name="cmsSystem"
              required
              value={formData.cmsSystem}
              onChange={handleChange}
              placeholder="bi-platform:6400"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sap-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Authentication Type</label>
            <select
              name="authType"
              value={formData.authType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sap-500 outline-none bg-white"
            >
              <option value="Basic">Basic Auth (User/Pass)</option>
              <option value="Token">Session Token (X-SAP-Token)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              required={formData.authType === 'Basic'}
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sap-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.authType === 'Basic' ? 'Password' : 'Token'}
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sap-500 outline-none font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-sap-600 hover:bg-sap-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
      
      <div className="bg-yellow-50 p-4 border-t border-yellow-100 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-800">
          <p className="font-semibold">Security Note</p>
          <p>This is a client-side application. Credentials are stored in your browser's local memory for this session only. Ensure you are using HTTPS to protect your data in transit.</p>
        </div>
      </div>
    </div>
  );
};