import { parse } from 'graphql';
import { executor,} from '../exectuor';

const GET_ADDRESS = `
  query GetAddress($username: String!) {
    address(username: $username) {
      street
      city
      zipcode
      state
    }
  }
`;

describe('getAddress', () => {
  test('Success — returns address with state', async () => {
    const result = await executor({
      document: parse(GET_ADDRESS),
      variables: { username: 'jack' },
    });

    expect(result).toMatchObject({
      data: {
        address: {
          street: '123 Street St.',
          city: 'Sometown',
          zipcode: '43215',
          state: 'South Carolina',
        },
      },
    });
  });

  test('Error — unknown username returns GraphQL error', async () => {
    const result = await executor({
      document: parse(GET_ADDRESS),
      variables: { username: 'unknown' },
    });

    expect(result).toMatchObject({
      errors: expect.arrayContaining([
        expect.objectContaining({ message: 'No address found in getAddress resolver' }),
      ]),
    });
  });
});
