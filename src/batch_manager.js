/**
* batchTask
*
* Example batch task function
* Calls relevant logic within object of BatchManager class
*
* @return {Promise}
*/

import config from './configuration';
import AuroraManager from './aurora_manager';

import co from 'co';

export function batchTask(logger) {
  let batchManager = new BatchManager(logger);
  return new Promise((resolve, reject) => {
    batchManager.execute().then((result) => {
      logger.info('Successfully ran batch task', result);
      resolve(result);
    }, (error) => {
      logger.error('Could not run batch task', error);
      reject(error);
    });
  });
};

/**
* BatchManager
*
* Class for example batch execution logic
*/
class BatchManager {
  constructor(logger) {
    this.logger = logger;
    this.auroraManager = new AuroraManager(config.DB_HOST, config.DB_USER, config.DB_PASSWORD, config.DB_DATABASE);
  }

  execute() {
    let _this = this;
    return co(function* () {
      // setup connection
      _this.auroraManager.connect();

      yield _this.guaranteeInvocationCountTable();
      yield _this.writeInvocationCountRecord();

      // teardown connection
      _this.auroraManager.disconnect();

      return true;
    });
  }

  guaranteeInvocationCountTable() {
    let _this = this;

    let command = 'CREATE TABLE IF NOT EXISTS invocation_count ('
      + 'entry_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, '
      + 'execution_date DATETIME DEFAULT CURRENT_TIMESTAMP)';

    return _this.auroraManager.queryPromise(command);
  }

  writeInvocationCountRecord() {
    let _this = this;

    return _this.auroraManager.queryPromise('INSERT INTO invocation_count SET ?', {
      execution_date: new Date
    });
  }
};
