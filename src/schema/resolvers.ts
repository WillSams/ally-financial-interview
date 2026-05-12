import { getAddress } from './address/address';
import { Address, Args, Context } from './address/types';

export const resolvers = {
  Query: {
    address: (parent: unknown, args: Args, context: Context): Address => {
      return getAddress(parent, args, context);
    },
  },
};
