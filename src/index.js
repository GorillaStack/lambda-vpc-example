import loggerConstructor from './logger';
import config from './configuration';

const logger = loggerConstructor();

const handler = () => {
  logger.info('BEGINNING Lambda function');
  logger.debug('ENDING Lambda function');
};

export default {
  handler: handler
};
