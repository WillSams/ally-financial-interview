// Mock winston before Logger is imported so the constructor uses our mock
jest.mock('winston', () => ({
  createLogger: jest.fn(),
  format: {
    combine: jest.fn(() => ({})),
    timestamp: jest.fn(() => ({})),
    json: jest.fn(() => ({})),
  },
  transports: {
    Console: jest.fn(),
  },
}));

import winston from 'winston';
import { Logger } from '../../src/logger';

describe('Logger', () => {
  let mockInfo: jest.Mock;
  let mockError: jest.Mock;
  let mockWarn: jest.Mock;

  beforeEach(() => {
    mockInfo = jest.fn();
    mockError = jest.fn();
    mockWarn = jest.fn();
    (winston.createLogger as jest.Mock).mockReturnValue({
      info: mockInfo,
      error: mockError,
      warn: mockWarn,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('info passes requestId and client to underlying logger', () => {
    const logger = new Logger();
    logger.setRequestId('req-abc-123');
    logger.setClient('ally');
    logger.info('test message');
    expect(mockInfo).toHaveBeenCalledWith('test message', { requestId: 'req-abc-123', client: 'ally' });
  });

  test('error passes requestId and client to underlying logger', () => {
    const logger = new Logger();
    logger.setRequestId('req-def-456');
    logger.setClient('ally');
    logger.error('something broke');
    expect(mockError).toHaveBeenCalledWith('something broke', { requestId: 'req-def-456', client: 'ally' });
  });

  test('warn passes requestId and client to underlying logger', () => {
    const logger = new Logger();
    logger.setRequestId('req-ghi-789');
    logger.setClient('strata');
    logger.warn('heads up');
    expect(mockWarn).toHaveBeenCalledWith('heads up', { requestId: 'req-ghi-789', client: 'strata' });
  });

  test('info merges additional meta with requestId and client', () => {
    const logger = new Logger();
    logger.setRequestId('req-merge');
    logger.setClient('ally');
    logger.info('with meta', { userId: 42 });
    expect(mockInfo).toHaveBeenCalledWith('with meta', { userId: 42, requestId: 'req-merge', client: 'ally' });
  });

  test('client defaults to empty string when not set', () => {
    const logger = new Logger();
    logger.setRequestId('req-no-client');
    logger.info('no client set');
    expect(mockInfo).toHaveBeenCalledWith('no client set', { requestId: 'req-no-client', client: '' });
  });
});
