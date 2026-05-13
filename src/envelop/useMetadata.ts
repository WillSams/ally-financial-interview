import type { Plugin } from '@envelop/core';
import { isAsyncIterable } from '@envelop/core';
import { ExecutionResult } from 'graphql';
import { ContextType } from '../types';

type ResultWithMetadata = ExecutionResult & {
  metadata: { requestId: string };
};

export const useMetadata = (): Plugin<ContextType> => {
  return {
    // requestId is captured from args.contextValue here in onExecute's closure because
    // onExecuteDone does not re-receive context — only result and setResult? I need to verify that in docs.
    onExecute({ args }) {
      return {
        onExecuteDone({ result, setResult }) {
          // AsyncIterable results are subscriptions — skip metadata injection there.
          // For all standard query/mutation responses this branch is never taken.
          if (isAsyncIterable(result)) {
            return;
          }
          // metadata is a non-standard top-level field (GraphQL spec allows only data,
          // errors, extensions). We use metadata per the project spec?  Veryify with interviewer.
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
