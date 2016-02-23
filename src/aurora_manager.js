import mysql from 'mysql';

const DEFAULT_DATABASE_NAME = 'exDB';

class AuroraManager {
  constructor(host, user, password, database) {
    this.host = host;
    this.user = user;
    this.password = password;
    this.database = database || DEFAULT_DATABASE_NAME;
  }

  connect() {
    this.connection = mysql.createConnection({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database
    });

    this.connection.connect();
  }

  disconnect() {
    this.connection.end();
  }

  /**
  * queryPromise
  *
  * Call mysql.query in any of its 3 forms (sqlString), (sqlString, values), (options)
  * Do not provide the callback function argument
  */
  queryPromise(...args) {
    let _this = this;
    return new Promise((resolve, reject) => {
      const callback = (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      };

      args.push(callback);
      _this.connection.query.apply(_this.connection, args);
    });
  }
};

export default AuroraManager;
