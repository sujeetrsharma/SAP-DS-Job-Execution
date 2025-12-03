import React from 'react';
import { ExecutionLog } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, CheckCircle, XCircle, Server } from 'lucide-react';

interface DashboardProps {
  logs: ExecutionLog[];
  onQuickRun: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ logs, onQuickRun }) => {
  const successCount = logs.filter(l => l.status === 'Success').length;
  const failCount = logs.filter(l => l.status === 'Failed').length;
  const totalCount = logs.length;

  const data = [
    { name: 'Success', value: successCount, color: '#22c55e' },
    { name: 'Failed', value: failCount, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg">
             <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Executions</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 rounded-lg">
             <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Successful Runs</p>
            <h3 className="text-2xl font-bold text-gray-900">{successCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-50 rounded-lg">
             <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Failed Runs</p>
            <h3 className="text-2xl font-bold text-gray-900">{failCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-800 mb-4">Execution Stats</h3>
           <div className="h-64">
             {totalCount > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip cursor={{fill: '#f3f4f6'}} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Server className="w-8 h-8 mb-2 opacity-50" />
                    <p>No data available</p>
                </div>
             )}
           </div>
        </div>

        <div className="bg-gradient-to-br from-sap-600 to-sap-900 p-6 rounded-xl shadow-lg text-white flex flex-col justify-between">
           <div>
               <h3 className="text-xl font-bold mb-2">Ready to Process?</h3>
               <p className="text-sap-100 opacity-90 mb-6">Access the Job Runner to execute Batch jobs manually or use the Gemini AI Assistant to parse natural language commands.</p>
           </div>
           <button 
             onClick={onQuickRun}
             className="w-full bg-white text-sap-600 font-bold py-3 rounded-lg hover:bg-sap-50 transition-colors"
           >
             Go to Job Runner
           </button>
        </div>
      </div>
    </div>
  );
};