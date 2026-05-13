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

  test('info passes requestId to underlying logger', () => {
    const logger = new Logger();
    logger.setRequestId('req-abc-123');
    logger.info('test message');
    expect(mockInfo).toHaveBeenCalledWith('test message', { requestId: 'req-abc-123' });
  });

  test('error passes requestId to underlying logger', () => {
    const logger = new Logger();
    logger.setRequestId('req-def-456');
    logger.error('something broke');
    expect(mockError).toHaveBeenCalledWith('something broke', { requestId: 'req-def-456' });
  });

  test('warn passes requestId to underlying logger', () => {
    const logger = new Logger();
    logger.setRequestId('req-ghi-789');
    logger.warn('heads up');
    expect(mockWarn).toHaveBeenCalledWith('heads up', { requestId: 'req-ghi-789' });
  });

  test('info merges additional meta with requestId', () => {
    const logger = new Logger();
    logger.setRequestId('req-merge');
    logger.info('with meta', { userId: 42 });
    expect(mockInfo).toHaveBeenCalledWith('with meta', { userId: 42, requestId: 'req-merge' });
  });
});
