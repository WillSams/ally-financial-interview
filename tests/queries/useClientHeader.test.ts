import { parse } from 'graphql';
import { executor, strataExecutor, noClientExecutor } from '../executor';
import { GET_ADDRESS, CREATE_ADDRESS } from '../consts';

describe('useClientHeader', () => {
  describe('missing client header', () => {
    test('rejects a query when client header is absent', async () => {
      const result = await noClientExecutor({
        document: parse(GET_ADDRESS),
        variables: { username: 'jack' },
      });

      expect(result).toMatchObject({
        errors: expect.arrayContaining([expect.objectContaining({ message: 'Missing required client header' })]),
      });
    });

    test('rejects a mutation when client header is absent', async () => {
      const result = await noClientExecutor({
        document: parse(CREATE_ADDRESS),
        variables: {
          username: 'headertest',
          address: { street: '1 Test St', city: 'Testville', zipcode: '00000', state: 'OH' },
        },
      });

      expect(result).toMatchObject({
        errors: expect.arrayContaining([expect.objectContaining({ message: 'Missing required client header' })]),
      });
    });
  });

  describe('valid client header (ally)', () => {
    test('allows a query', async () => {
      const result = await executor({
        document: parse(GET_ADDRESS),
        variables: { username: 'jack' },
      });

      expect(result).toMatchObject({
        data: { address: expect.any(Object) },
      });
    });
  });

  describe('strata client', () => {
    test('allows a query', async () => {
      const result = await strataExecutor({
        document: parse(GET_ADDRESS),
        variables: { username: 'jack' },
      });

      expect(result).toMatchObject({
        data: { address: expect.any(Object) },
      });
    });

    test('rejects a mutation', async () => {
      const result = await strataExecutor({
        document: parse(CREATE_ADDRESS),
        variables: {
          username: 'stratatest',
          address: { street: '1 Strata Ln', city: 'Blocked', zipcode: '55555', state: 'TX' },
        },
      });

      expect(result).toMatchObject({
        errors: expect.arrayContaining([
          expect.objectContaining({ message: 'Mutations are not allowed for strata clients' }),
        ]),
      });
    });
  });
});
