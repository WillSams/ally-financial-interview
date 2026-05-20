import { parse } from 'graphql';
import fs from 'fs';

import { executor } from '../executor';
import { GET_ADDRESS, CREATE_ADDRESS, UUID_REGEX, DATA_PATH } from '../consts';
import { ResultWithMetadata } from '../types';

const SEED_DATA = JSON.stringify(
  {
    jack: { street: '123 Street St.', city: 'Sometown', zipcode: '43215', state: 'South Carolina' },
    jill: { street: '234 Other St', city: 'Townville', zipcode: '32145', state: 'North Carolina' },
  },
  null,
  2,
);

describe('useMetadata (ticket #6)', () => {
  beforeAll(() => {
    fs.writeFileSync(DATA_PATH, SEED_DATA);
  });

  afterAll(() => {
    fs.writeFileSync(DATA_PATH, SEED_DATA);
  });
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
