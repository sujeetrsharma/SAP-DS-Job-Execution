import React, { useState } from 'react';
import { JobConfiguration, GlobalVariable, ServerConfig, ExecutionLog, ParsedJobRequest } from '../types';
import { executeSapJob } from '../services/sapService';
import { parseJobIntent } from '../services/geminiService';
import { Play, Plus, Trash2, Zap, Loader2, Sparkles, Terminal } from 'lucide-react';

interface JobRunnerProps {
  serverConfig: ServerConfig;
  onExecute: (log: ExecutionLog) => void;
}

export const JobRunner: React.FC<JobRunnerProps> = ({ serverConfig, onExecute }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [useMock, setUseMock] = useState(true);

  // Manual State
  const [jobName, setJobName] = useState('');
  const [repoName, setRepoName] = useState('MAIN_REPO');
  const [jobServer, setJobServer] = useState('JS_PROD_01');
  const [globalVars, setGlobalVars] = useState<GlobalVariable[]>([{ key: '$G_', value: '' }]);

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiParsing, setAiParsing] = useState(false);
  const [aiResult, setAiResult] = useState<ParsedJobRequest | null>(null);

  const handleRunJob = async () => {
    setIsLoading(true);
    const config: JobConfiguration = {
      jobName: activeTab === 'manual' ? jobName : (aiResult?.jobName || ''),
      repoName,
      jobServer,
      globalVariables: activeTab === 'manual' ? globalVars.filter(g => g.key.length > 3) : Object.entries(aiResult?.globalVariables || {}).map(([key, value]) => ({ key, value: String(value) })),
    };

    try {
      const result = await executeSapJob(serverConfig, config, useMock);
      onExecute(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiParse = async () => {
    if (!aiPrompt.trim()) return;
    setAiParsing(true);
    setAiResult(null);
    try {
      const result = await parseJobIntent(aiPrompt, ['Daily_Sales_Load', 'Monthly_Finance_Close', 'Master_Data_Sync']);
      setAiResult(result);
    } catch (error) {
      console.error("AI Parsing failed", error);
      alert("AI failed to parse intent. Please check API Key configuration.");
    } finally {
      setAiParsing(false);
    }
  };

  const addVar = () => setGlobalVars([...globalVars, { key: '$G_', value: '' }]);
  const removeVar = (idx: number) => setGlobalVars(globalVars.filter((_, i) => i !== idx));
  const updateVar = (idx: number, field: 'key' | 'value', val: string) => {
    const newVars = [...globalVars];
    newVars[idx][field] = val;
    setGlobalVars(newVars);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Configuration Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
                  activeTab === 'manual' 
                  ? 'text-sap-600 border-b-2 border-sap-600 bg-gray-50' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Manual Execution
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === 'ai' 
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                  : 'text-gray-500 hover:text-purple-600'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Assistant</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'manual' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Job Name</label>
                        <input
                            type="text"
                            value={jobName}
                            onChange={(e) => setJobName(e.target.value)}
                            placeholder="JOB_Daily_Extract"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sap-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Job Server</label>
                        <input
                            type="text"
                            value={jobServer}
                            onChange={(e) => setJobServer(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sap-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Global Variables</label>
                    <button onClick={addVar} className="text-sap-600 hover:bg-sap-50 p-1 rounded transition">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {globalVars.map((gv, idx) => (
                      <div key={idx} className="flex space-x-2">
                        <input
                          type="text"
                          value={gv.key}
                          onChange={(e) => updateVar(idx, 'key', e.target.value)}
                          placeholder="$G_VarName"
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sap-500 outline-none"
                        />
                        <input
                          type="text"
                          value={gv.value}
                          onChange={(e) => updateVar(idx, 'value', e.target.value)}
                          placeholder="Value"
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sap-500 outline-none"
                        />
                        <button onClick={() => removeVar(idx)} className="text-red-400 hover:text-red-600 px-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                 <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">Describe the job execution</label>
                     <div className="relative">
                        <textarea 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none text-gray-700"
                            placeholder='e.g., "Run the Monthly_Finance_Close job for region US with fiscal year 2023"'
                        />
                        <div className="absolute bottom-3 right-3">
                            <button
                                onClick={handleAiParse}
                                disabled={aiParsing || !aiPrompt}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1 disabled:opacity-50 transition-colors"
                            >
                                {aiParsing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
                                <span>Parse Intent</span>
                            </button>
                        </div>
                     </div>
                 </div>

                 {aiResult && (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 space-y-3 animate-fade-in">
                        <div className="flex items-start justify-between">
                             <h3 className="text-sm font-bold text-purple-900 uppercase">Parsed Configuration</h3>
                             <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Confidence: High</span>
                        </div>
                        <div className="text-sm text-purple-800 space-y-1">
                            <p><span className="font-semibold">Job:</span> {aiResult.jobName}</p>
                            <p><span className="font-semibold">Explanation:</span> {aiResult.explanation}</p>
                            <div>
                                <span className="font-semibold">Global Variables:</span>
                                <ul className="list-disc list-inside pl-2 mt-1">
                                    {Object.entries(aiResult.globalVariables).map(([k, v]) => (
                                        <li key={k} className="font-mono text-xs">{k}: <span className="text-purple-600">{v}</span></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                 )}
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
             <div className="flex items-center space-x-2">
                <input 
                    type="checkbox" 
                    id="mockMode" 
                    checked={useMock} 
                    onChange={(e) => setUseMock(e.target.checked)}
                    className="rounded border-gray-300 text-sap-600 focus:ring-sap-500"
                />
                <label htmlFor="mockMode" className="text-sm text-gray-600 select-none cursor-pointer">Simulate Mode (No API Call)</label>
             </div>
             
             <button
                onClick={handleRunJob}
                disabled={isLoading || (activeTab === 'manual' && !jobName) || (activeTab === 'ai' && !aiResult)}
                className="flex items-center space-x-2 bg-sap-600 hover:bg-sap-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-bold shadow-md shadow-sap-200 transition-all transform active:scale-95"
             >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                <span>Execute Job</span>
             </button>
          </div>
        </div>
      </div>

      {/* Info Column */}
      <div className="space-y-6">
        <div className="bg-slate-900 text-slate-300 p-6 rounded-xl shadow-lg border border-slate-700 h-full flex flex-col">
           <div className="flex items-center space-x-2 mb-4 border-b border-slate-700 pb-3">
               <Terminal className="w-5 h-5 text-green-400" />
               <h3 className="font-mono text-sm font-bold text-white">Execution Preview</h3>
           </div>
           
           <div className="font-mono text-xs space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                <p><span className="text-blue-400">Target:</span> {serverConfig.baseUrl || 'Not Configured'}</p>
                <p><span className="text-blue-400">Server:</span> {jobServer}</p>
                <p><span className="text-blue-400">Repo:</span> {repoName}</p>
                <div className="border-t border-slate-800 my-2 pt-2">
                    <p className="text-slate-500 mb-1">// Payload Structure</p>
                    <div className="text-green-300 whitespace-pre-wrap break-all">
                        {JSON.stringify({
                            jobName: activeTab === 'manual' ? jobName : (aiResult?.jobName || 'Waiting for AI...'),
                            globalVars: activeTab === 'manual' 
                                ? Object.fromEntries(globalVars.filter(g => g.key.length > 1).map(g => [g.key, g.value])) 
                                : aiResult?.globalVariables
                        }, null, 2)}
                    </div>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};