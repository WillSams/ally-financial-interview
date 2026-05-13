import type { Plugin } from '@envelop/core';
import { isAsyncIterable } from '@envelop/core';
import { ExecutionResult } from 'graphql';
import { ContextType } from '../types';

type ResultWithMetadata = ExecutionResult & {
  metadata: { requestId: string };
};

export const useMetadata = (): Plugin<ContextType> => {
  return {
    onExecute({ args }) {
      return {
        onExecuteDone({ result, setResult }) {
          if (isAsyncIterable(result)) {
            return;
          }
          const withMetadata: ResultWithMetadata = {
            ...result,
            metadata: { requestId: args.contextValue.requestId },
          };
          setResult(withMetadata);
        },
      };
    },
  };
};
