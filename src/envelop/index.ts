import { Plugin, useEngine } from '@envelop/core';
import { parse, validate, specifiedRules, execute, subscribe } from 'graphql';
import { useParserCache } from '@envelop/parser-cache';
import { useValidationCache } from '@envelop/validation-cache';
import { buildHeaders } from './buildHeaders';
import { useLogger } from './useLogger';
import { ContextType } from '../types';
import { useClientHeader } from './useClientHeader';
import { useMetadata } from './useMetadata';

// !Important! Plugin order matters. buildHeaders uses onContextBuilding so requestId and client
// are stamped on context before any onExecute hook runs. useLogger and useClientHeader
// both depend on those values being present, so they must come after buildHeaders.
const plugins: Plugin<ContextType>[] = [
  useEngine({ parse, validate, specifiedRules, execute, subscribe }) as Plugin<ContextType>,
  buildHeaders(),
  useLogger(),
  useClientHeader(),
  useMetadata(),
  useParserCache() as Plugin<ContextType>,
  useValidationCache() as Plugin<ContextType>,
];

export default plugins;
