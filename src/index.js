import loggerConstructor from './logger';
import config from './configuration';

const logger = loggerConstructor();

const main = () => {
  logger.debug('BEGINNING Lambda function');
  logger.debug('ENDING Lambda function');
};

export default main;

main();
