import type { Plugin } from '@envelop/core';
import { isAsyncIterable } from '@envelop/core';
import { ExecutionResult } from 'graphql';
import { ContextType } from '../types';

type ResultWithMetadata = ExecutionResult & {
  metadata: { requestId: string };
};

export const useMetadata = (): Plugin<ContextType> => {
  return {
    // requestId is captured in the onExecute closure because onExecuteDone only receives
    // result and setResult — context is not re-provided there.
    onExecute({ args }) {
      return {
        onExecuteDone({ result, setResult }) {
          // AsyncIterable results are subscriptions — skip metadata injection there.
          if (isAsyncIterable(result)) {
            return;
          }
          // The spec-compliant field would be extensions.requestId, but the project
          // spec requires a top-level metadata field.
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
