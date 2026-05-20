import type { Plugin } from '@envelop/core';
import { v4 as uuid } from 'uuid';
import { ContextType } from '../types';
import { requestIds } from './requestStore';

type YogaContext = ContextType & { request: Request };

// onContextBuilding fires before parse/validate/execute, ensuring requestId and client
// are available on the context before any resolver or plugin reads them (ticket #4).
export const buildHeaders = (): Plugin<ContextType> => {
  return {
    onContextBuilding({ context, extendContext }) {
      // request is not part of our ContextType, resolvers should never need it.
      const requestId = uuid();
      const ctx = context as YogaContext;
      const client = ctx.request?.headers?.get('client') ?? null;
      // Also store in requestIds so useMetadata can inject metadata on validation
      // error responses, where onExecuteDone never fires.
      if (ctx.request) {
        requestIds.set(ctx.request, requestId);
      }
      extendContext({ requestId, client });
    },
  };
};
