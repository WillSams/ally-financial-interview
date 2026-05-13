import { parse } from 'graphql';
import fs from 'fs';
import { executor, strataExecutor } from '../exectuor';

import { DATA_PATH, CREATE_ADDRESS, GET_ADDRESS } from '../consts';

describe('createAddress', () => {
  let originalData: string;

  beforeAll(() => {
    originalData = fs.readFileSync(DATA_PATH, 'utf-8');
  });

  afterAll(() => {
    fs.writeFileSync(DATA_PATH, originalData);
  });

  test('Success — creates and returns new address', async () => {
    const result = await executor({
      document: parse(CREATE_ADDRESS),
      variables: {
        username: 'testuser',
        address: { street: '1 Test Ave', city: 'Testburg', zipcode: '99999', state: 'TX' },
      },
    });

    expect(result).toMatchObject({
      data: {
        createAddress: {
          street: '1 Test Ave',
          city: 'Testburg',
          zipcode: '99999',
          state: 'TX',
        },
      },
    });
  });

  test('Success — created address is persisted and queryable', async () => {
    await executor({
      document: parse(CREATE_ADDRESS),
      variables: {
        username: 'persistuser',
        address: { street: '2 Persist Rd', city: 'Saveville', zipcode: '11111', state: 'CA' },
      },
    });

    const result = await executor({
      document: parse(GET_ADDRESS),
      variables: { username: 'persistuser' },
    });

    expect(result).toMatchObject({
      data: { address: { street: '2 Persist Rd', city: 'Saveville', zipcode: '11111', state: 'CA' } },
    });
  });

  test('Error — duplicate username returns GraphQL error', async () => {
    await executor({
      document: parse(CREATE_ADDRESS),
      variables: {
        username: 'dupuser',
        address: { street: '3 Dup St', city: 'Twin City', zipcode: '22222', state: 'NY' },
      },
    });

    const result = await executor({
      document: parse(CREATE_ADDRESS),
      variables: {
        username: 'dupuser',
        address: { street: '3 Dup St', city: 'Twin City', zipcode: '22222', state: 'NY' },
      },
    });

    expect(result).toMatchObject({
      errors: expect.arrayContaining([expect.objectContaining({ message: 'Address already exists for username' })]),
    });
  });

  test('Error — strata client cannot run mutations', async () => {
    const result = await strataExecutor({
      document: parse(CREATE_ADDRESS),
      variables: {
        username: 'stratauser',
        address: { street: '4 Strata Blvd', city: 'Restricted', zipcode: '33333', state: 'WA' },
      },
    });

    expect(result).toMatchObject({
      errors: expect.arrayContaining([
        expect.objectContaining({ message: 'Mutations are not allowed for strata clients' }),
      ]),
    });
  });
});
