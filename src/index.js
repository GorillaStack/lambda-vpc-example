import 'babel-polyfill';

import loggerConstructor from './logger';
import {batchTask} from './batch_manager';

const logger = loggerConstructor();

export function handler(event, context) {
  logger.debug('BEGINNING Lambda function');
  return new Promise((resolve, reject) => {
    batchTask(logger).then(
      (result) => {
        context.succeed();
      },

      (error) => {
        context.fail(error);
      }
    ).catch((error) => {
      context.fail(error);
    });
  });
};
