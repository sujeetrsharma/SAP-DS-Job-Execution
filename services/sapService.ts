import { ServerConfig, JobConfiguration, ExecutionLog } from '../types';

/**
 * Executes a job against an SAP Data Services REST Endpoint.
 * Note: Real SAP DS REST APIs vary heavily by implementation (WSDL-to-REST wrappers, BOBJ REST SDK, etc.).
 * This implements a generic POST pattern common in enterprise REST wrappers.
 */
export const executeSapJob = async (
  serverConfig: ServerConfig,
  jobConfig: JobConfiguration,
  useMock: boolean = true
): Promise<ExecutionLog> => {
  
  const logEntry: ExecutionLog = {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    jobName: jobConfig.jobName,
    status: 'Pending',
    message: 'Initializing request...',
  };

  // Construct Global Variables Object for Payload
  const gVarsObject: Record<string, string> = {};
  jobConfig.globalVariables.forEach(gv => {
    gVarsObject[gv.key] = gv.value;
  });

  const payload = {
    jobName: jobConfig.jobName,
    repoName: jobConfig.repoName,
    jobServer: jobConfig.jobServer,
    serverGroup: jobConfig.serverGroup,
    globalVariables: gVarsObject,
    cmsSystem: serverConfig.cmsSystem
  };

  logEntry.requestPayload = payload;

  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate for simulation
        logEntry.status = success ? 'Success' : 'Failed';
        logEntry.message = success 
          ? `Job ${jobConfig.jobName} triggered successfully. PID: ${Math.floor(Math.random() * 9000) + 1000}` 
          : `Error: Connection timed out to Job Server ${jobConfig.jobServer}.`;
        logEntry.responsePayload = success 
          ? { status: "OK", pid: Math.floor(Math.random() * 10000), runId: crypto.randomUUID() } 
          : { status: "ERROR", code: 503, message: "Service Unavailable" };
        resolve(logEntry);
      }, 1500);
    });
  }

  // Real Execution Logic (Generic Implementation)
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (serverConfig.authType === 'Basic') {
      headers['Authorization'] = 'Basic ' + btoa(`${serverConfig.username}:${serverConfig.password || ''}`);
    } else {
      headers['X-SAP-Token'] = serverConfig.password || ''; // Assuming password field holds token
    }

    // Construct URL - usually something like /api/v1/jobs/execute
    // Ensure no double slashes if user added trailing slash
    const baseUrl = serverConfig.baseUrl.replace(/\/$/, '');
    const url = `${baseUrl}/jobs/${jobConfig.jobName}/execute`;

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status} - ${response.statusText}`);
    }

    logEntry.status = 'Success';
    logEntry.message = 'Job executed successfully via API.';
    logEntry.responsePayload = data;

  } catch (error: any) {
    logEntry.status = 'Failed';
    const errorMsg = error.message || error.toString();
    
    // enhance error message for common CORS/Network issues
    if (errorMsg === 'Failed to fetch' || errorMsg.includes('NetworkError')) {
       logEntry.message = 'Network Error (Possible CORS issue). Ensure your SAP server allows requests from this domain.';
    } else {
       logEntry.message = errorMsg;
    }
    
    logEntry.responsePayload = { error: errorMsg };
  }

  return logEntry;
};