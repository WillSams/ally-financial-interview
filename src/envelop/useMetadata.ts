import type { Plugin } from 'graphql-yoga';
import { isAsyncIterable } from '@envelop/core';
import { ExecutionResult } from 'graphql';
import { ContextType } from '../types';
import { requestIds } from './requestStore';

type ResultWithMetadata = ExecutionResult & {
  metadata: { requestId: string };
};

export const useMetadata = (): Plugin => {
  return {
    // onResultProcess fires for every HTTP response — execution, validation errors, and
    // parse errors — so metadata.requestId is always present. The requestId is looked up
    // from requestStore because context is not available at this point in the lifecycle.
    // The spec-compliant field would be extensions.requestId, but the project spec
    // requires a top-level metadata field.
    onResultProcess({ request, result, setResult }) {
      if (isAsyncIterable(result)) {
        return;
      }
      const requestId = requestIds.get(request) ?? '';
      const withMetadata: ResultWithMetadata = {
        ...(result as ExecutionResult),
        metadata: { requestId },
      };
      setResult(withMetadata);
    },
  };
};
