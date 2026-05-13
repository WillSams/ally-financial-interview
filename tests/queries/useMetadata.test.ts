import { parse } from 'graphql';

import { executor } from '../exectuor';
import { GET_ADDRESS, CREATE_ADDRESS, UUID_REGEX } from '../consts';
import { ResultWithMetadata } from '../types';

describe('useMetadata (ticket #6)', () => {
  test('query response includes metadata.requestId', async () => {
    const result = (await executor({
      document: parse(GET_ADDRESS),
      variables: { username: 'jack' },
    })) as ResultWithMetadata;

    expect(result.metadata).toBeDefined();
    expect(result.metadata.requestId).toMatch(UUID_REGEX);
  });

  test('mutation response includes metadata.requestId', async () => {
    const result = (await executor({
      document: parse(CREATE_ADDRESS),
      variables: {
        username: 'metauser',
        address: { street: '5 Meta Ln', city: 'Metacity', zipcode: '44444', state: 'OR' },
      },
    })) as ResultWithMetadata;

    expect(result.metadata).toBeDefined();
    expect(result.metadata.requestId).toMatch(UUID_REGEX);
  });

  test('two requests produce different requestIds in metadata', async () => {
    const first = (await executor({
      document: parse(GET_ADDRESS),
      variables: { username: 'jack' },
    })) as ResultWithMetadata;

    const second = (await executor({
      document: parse(GET_ADDRESS),
      variables: { username: 'jill' },
    })) as ResultWithMetadata;

    expect(first.metadata.requestId).toMatch(UUID_REGEX);
    expect(second.metadata.requestId).toMatch(UUID_REGEX);
    expect(first.metadata.requestId).not.toBe(second.metadata.requestId);
  });

  test('error response still includes metadata.requestId', async () => {
    const result = (await executor({
      document: parse(GET_ADDRESS),
      variables: { username: 'nobody' },
    })) as ResultWithMetadata;

    expect(result.errors).toBeDefined();
    expect(result.metadata).toBeDefined();
    expect(result.metadata.requestId).toMatch(UUID_REGEX);
  });
});
