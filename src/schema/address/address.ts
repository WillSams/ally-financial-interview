import * as addressTable from '../../../data/addresses.json';
import { Addresses, Address, Args, Context } from './types';
import { GraphQLError } from 'graphql';

const addresses = addressTable as Addresses;
const _getAddress = (username: string): Address | null => {
  return addresses[username];
};

export const getAddress = (_: unknown, args: Args, context: Context): Address => {
  context.logger.info('getAddress', 'Enter resolver');
  const address = _getAddress(args.username);
  if (address) {
    context.logger.info('getAddress', 'Returning address');
    return address;
  }
  context.logger.error('getAddress', 'No address found');
  throw new GraphQLError('No address found in getAddress resolver');
};
