import { Logger } from '../logger';

export type ContextType = {
  requestId: string;
  client: string | null;
  logger: Logger;
};
