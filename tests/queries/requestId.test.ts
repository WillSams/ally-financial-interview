import { parse } from 'graphql';
import { executor } from '../exectuor';
import { Logger } from '../../src/logger';

const GET_ADDRESS = `
  query GetAddress($username: String!) {
    address(username: $username) {
      street
      city
    }
  }
`;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe('requestId in logs (ticket #4)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('every log call within a request carries a valid UUID requestId', async () => {
    const capturedIds: string[] = [];

    jest.spyOn(Logger.prototype, 'info').mockImplementation(function (this: Logger) {
      capturedIds.push(this.requestId);
    });
    jest.spyOn(Logger.prototype, 'error').mockImplementation(function (this: Logger) {
      capturedIds.push(this.requestId);
    });

    await executor({
      document: parse(GET_ADDRESS),
      variables: { username: 'jack' },
    });

    expect(capturedIds.length).toBeGreaterThan(0);
    capturedIds.forEach((id) => {
      expect(id).toMatch(UUID_REGEX);
    });
  });

  test('all log calls within one request share the same requestId', async () => {
    const capturedIds: string[] = [];

    jest.spyOn(Logger.prototype, 'info').mockImplementation(function (this: Logger) {
      capturedIds.push(this.requestId);
    });

    await executor({
      document: parse(GET_ADDRESS),
      variables: { username: 'jack' },
    });

    expect(capturedIds.length).toBeGreaterThan(1);
    expect(new Set(capturedIds).size).toBe(1);
  });

  test('different requests get different requestIds', async () => {
    const requestIds: string[] = [];

    jest.spyOn(Logger.prototype, 'info').mockImplementation(function (this: Logger) {
      if (!requestIds.includes(this.requestId)) {
        requestIds.push(this.requestId);
      }
    });

    await executor({ document: parse(GET_ADDRESS), variables: { username: 'jack' } });
    await executor({ document: parse(GET_ADDRESS), variables: { username: 'jill' } });

    expect(requestIds.length).toBe(2);
    expect(requestIds[0]).not.toBe(requestIds[1]);
  });
});
