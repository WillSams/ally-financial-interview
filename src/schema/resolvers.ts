import { getAddress, saveAddress } from './address/address';
import { Address, Args, CreateAddressArgs } from './address/types';
import { ContextType } from '../types';

export const resolvers = {
  Query: {
    address: (parent: unknown, args: Args, context: ContextType): Address => {
      return getAddress(parent, args, context);
    },
  },
  Mutation: {
    createAddress: (_: unknown, args: CreateAddressArgs, context: ContextType): Address => {
      return saveAddress(_, args, context);
    },
  },
};
