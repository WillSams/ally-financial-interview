import { getAddress, saveAddress } from './address/address';
import { Address, Args, CreateAddressArgs, Context } from './address/types';

export const resolvers = {
  Query: {
    address: (parent: unknown, args: Args, context: Context): Address => {
      return getAddress(parent, args, context);
    },
  },
  Mutation: {
    createAddress: (_: unknown, args: CreateAddressArgs, context: Context): Address => {
      return saveAddress(_, args, context);
    },
  },
};
