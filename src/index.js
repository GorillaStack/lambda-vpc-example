import loggerConstructor from './logger';
import config from './configuration';

const logger = loggerConstructor();

export function handler() {
  logger.info('BEGINNING Lambda function');
  logger.debug('ENDING Lambda function');
};
