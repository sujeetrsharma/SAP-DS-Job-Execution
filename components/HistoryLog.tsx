import React from 'react';
import { ExecutionLog } from '../types';
import { CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';

interface HistoryLogProps {
  logs: ExecutionLog[];
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No Execution History</h3>
        <p className="text-gray-500">Run a job to see the results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Execution History</h2>
      {logs.map((log) => (
        <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                {log.status === 'Success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {log.status === 'Failed' && <XCircle className="w-5 h-5 text-red-500" />}
                {log.status === 'Pending' && <Clock className="w-5 h-5 text-blue-500 animate-pulse" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{log.jobName}</h3>
                <p className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                <p className={`text-sm mt-1 ${log.status === 'Success' ? 'text-green-700' : 'text-red-700'}`}>
                  {log.message}
                </p>
              </div>
            </div>
            <div className="text-right">
               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                   log.status === 'Success' ? 'bg-green-100 text-green-800' : 
                   log.status === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
               }`}>
                   {log.status}
               </span>
            </div>
          </div>
          
          {log.status !== 'Pending' && (
              <details className="mt-4 group">
                  <summary className="flex items-center text-xs text-gray-500 cursor-pointer hover:text-gray-700 select-none">
                      <ChevronRight className="w-4 h-4 mr-1 transition-transform group-open:rotate-90" />
                      View Payload Details
                  </summary>
                  <div className="mt-2 bg-gray-50 p-3 rounded border border-gray-200 font-mono text-xs overflow-x-auto">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <strong className="block text-gray-600 mb-1">Request:</strong>
                              <pre className="text-gray-700">{JSON.stringify(log.requestPayload, null, 2)}</pre>
                          </div>
                          <div>
                              <strong className="block text-gray-600 mb-1">Response:</strong>
                              <pre className="text-gray-700">{JSON.stringify(log.responsePayload, null, 2)}</pre>
                          </div>
                      </div>
                  </div>
              </details>
          )}
        </div>
      ))}
    </div>
  );
};