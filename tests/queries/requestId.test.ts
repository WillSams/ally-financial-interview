import { parse } from 'graphql';
import { executor } from '../exectuor';
import { Logger } from '../../src/logger';
import { GET_ADDRESS, UUID_REGEX } from '../consts';

type LogCapture = { requestId: string; client: string };

describe('requestId and client in logs (tickets #4 & #5)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('every log call within a request carries a valid UUID requestId', async () => {
    const captured: LogCapture[] = [];

    jest.spyOn(Logger.prototype, 'info').mockImplementation(function (this: Logger) {
      captured.push({ requestId: this.requestId, client: this.client });
    });
    jest.spyOn(Logger.prototype, 'error').mockImplementation(function (this: Logger) {
      captured.push({ requestId: this.requestId, client: this.client });
    });

    await executor({
      document: parse(GET_ADDRESS),
      variables: { username: 'jack' },
    });

    expect(captured.length).toBeGreaterThan(0);
    captured.forEach(({ requestId }) => {
      expect(requestId).toMatch(UUID_REGEX);
    });
  });

  test('every log call within a request carries the client header', async () => {
    const captured: LogCapture[] = [];

    jest.spyOn(Logger.prototype, 'info').mockImplementation(function (this: Logger) {
      captured.push({ requestId: this.requestId, client: this.client });
    });
    jest.spyOn(Logger.prototype, 'error').mockImplementation(function (this: Logger) {
      captured.push({ requestId: this.requestId, client: this.client });
    });

    await executor({
      document: parse(GET_ADDRESS),
      variables: { username: 'jack' },
    });

    expect(captured.length).toBeGreaterThan(0);
    captured.forEach(({ client }) => {
      expect(client).toBe('ally');
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
