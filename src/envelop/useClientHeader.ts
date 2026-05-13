import type { Plugin } from '@envelop/core';
import { GraphQLError, OperationDefinitionNode, DefinitionNode, Kind } from 'graphql';
import { ContextType } from '../types';

export const useClientHeader = (): Plugin<ContextType> => {
  return {
    onExecute({ args }) {
      const client = args.contextValue.client;

      if (!client) {
        throw new GraphQLError('Missing required client header');
      }

      if (client === 'strata') {
        const isMutation = args.document.definitions.some(
          (def: DefinitionNode) =>
            def.kind === Kind.OPERATION_DEFINITION &&
            (def as OperationDefinitionNode).operation === 'mutation',
        );
        if (isMutation) {
          throw new GraphQLError('Mutations are not allowed for strata clients');
        }
      }
    },
  };
};
