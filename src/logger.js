import config from './configuration';

export default function(base) {
  const winston = require('winston');

  const logger = new (winston.Logger)({
    transports: [
      new winston.transports.Console({
        level: config.LOG_LEVEL || 'debug',
        handleExceptions: true,
        json: true
      })
    ]
  });

  return logger;
};
