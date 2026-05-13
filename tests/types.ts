import { ExecutionResult } from "graphql";

export type ResultWithMetadata = ExecutionResult & {
  metadata: { requestId: string };
};