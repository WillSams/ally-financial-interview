import type { Plugin } from '@envelop/core';
import { Logger } from '../logger';
import { ContextType } from '../types';

export const useLogger = (): Plugin<ContextType> => {
  return {
    // Logger is created per-request inside onExecute so each request gets an isolated
    // instance with its own requestId and client already stamped. 
    // A shared logger instance would race across concurrent requests.
    onExecute({ args, extendContext }) {
      const logger = new Logger();
      logger.setRequestId(args.contextValue.requestId || '');
      logger.setClient(args.contextValue.client || '');
      extendContext({ logger });
    },
  };
};
