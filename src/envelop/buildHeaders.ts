import type { Plugin } from '@envelop/core';
import { v4 as uuid } from 'uuid';
import { ContextType } from '../types';

type YogaContext = ContextType & { request: Request };

export const buildHeaders = (): Plugin<ContextType> => {
  return {
    onExecute({ args, extendContext }) {
      const requestId = uuid();
      const ctx = args.contextValue as YogaContext;
      const client = ctx.request?.headers?.get('client') ?? null;
      extendContext({ requestId, client });
    },
  };
};
