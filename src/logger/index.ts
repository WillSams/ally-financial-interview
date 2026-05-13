import winston from 'winston';

export class Logger {
  private winston: winston.Logger;
  requestId: string = '';
  client: string = '';
  constructor() {
    this.winston = winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [new winston.transports.Console()],
    });
  }

  setRequestId(requestId: string) {
    this.requestId = requestId;
  }

  setClient(client: string) {
    this.client = client;
  }

  // requestId and client are spread into every log call so each log line is
  // self-contained and correlatable without joining on a separate context store.
  // meta is spread first so neither field can be accidentally overridden by callers. 
  info(message: string, meta?: object) {
    this.winston.info(message, { ...meta, requestId: this.requestId, client: this.client });
  }

  error(message: string, meta?: object) {
    this.winston.error(message, { ...meta, requestId: this.requestId, client: this.client });
  }

  warn(message: string, meta?: object) {
    this.winston.warn(message, { ...meta, requestId: this.requestId, client: this.client });
  }
}
