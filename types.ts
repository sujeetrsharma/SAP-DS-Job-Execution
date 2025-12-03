export interface GlobalVariable {
  key: string;
  value: string;
}

export interface JobConfiguration {
  jobName: string;
  repoName: string;
  jobServer: string;
  serverGroup?: string;
  globalVariables: GlobalVariable[];
}

export interface ServerConfig {
  baseUrl: string;
  username: string;
  password?: string; // Optional for security, often user enters it per session
  cmsSystem: string;
  authType: 'Basic' | 'Token';
}

export interface ExecutionLog {
  id: string;
  timestamp: Date;
  jobName: string;
  status: 'Pending' | 'Success' | 'Failed';
  message: string;
  requestPayload?: any;
  responsePayload?: any;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  RUNNER = 'RUNNER',
  SETTINGS = 'SETTINGS',
  HISTORY = 'HISTORY'
}

export interface ParsedJobRequest {
  jobName: string;
  globalVariables: Record<string, string | number>;
  explanation?: string;
}