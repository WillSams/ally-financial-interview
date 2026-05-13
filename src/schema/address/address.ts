import fs from 'fs';
import path from 'path';
import { Addresses, Address, Args, CreateAddressArgs } from './types';
import { ContextType } from '../../types';
import { GraphQLError } from 'graphql';

const DATA_PATH = path.resolve(__dirname, '../../../data/addresses.json');

const readAddresses = (): Addresses => {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw) as Addresses;
};

export const getAddress = (_: unknown, args: Args, context: ContextType): Address => {
  context.logger.info('getAddress: Enter resolver');
  const addresses = readAddresses();
  const address = addresses[args.username] ?? null;
  if (address) {
    context.logger.info('getAddress: Returning address');
    return address;
  }
  context.logger.error('getAddress: No address found');
  throw new GraphQLError('No address found in getAddress resolver');
};

export const saveAddress = (_: unknown, args: CreateAddressArgs, context: ContextType): Address => {
  context.logger.info('saveAddress: Enter resolver');
  const addresses = readAddresses();
  if (addresses[args.username]) {
    context.logger.error('saveAddress: Username already exists');
    throw new GraphQLError('Address already exists for username');
  }
  addresses[args.username] = args.address;
  fs.writeFileSync(DATA_PATH, JSON.stringify(addresses, null, 2));
  context.logger.info('saveAddress: Address saved');
  return addresses[args.username];
};
