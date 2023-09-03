export interface LogBase {
  service: string;
  host: string;
  port: string;
  thread: string;
  severity: string;
  pid: string;
  type: string;
  userId: string;
  orgId: string;
  userHost: string;
  fsysId: string;
}
export interface Operator {
  className: string;
  swaggerApi: string;
  classMethod: string;
  swaggerApiOperation: string;
  method: string;
  url: string;
  clientIp: string;
  sessionId: string;
  startTime: string;
  endTime: string;
  returnTime: string;
  timeConsuming: string;
  httpStatusCode: string;
}
export interface saveLogDetails {
  requestData: any;
  responseData: any;
  className: string;
  swaggerApi: string;
  classMethod: string;
  swaggerApiOperation: string;
  method: string;
  url: string;
  clientIp: string;
  sessionId: string;
  startTime: string;
  endTime: string;
  returnTime: string;
  timeConsuming: string;
  httpStatusCode: string;
  service: string;
  host: string;
  port: string;
  thread: string;
  severity: string;
  pid: string;
  type: string;
  userId: string;
  orgId: string;
  userHost: string;
  fsysId: string;
}
