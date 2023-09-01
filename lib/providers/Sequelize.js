const { Sequelize } = require('sequelize');

const rootPrefix = '../..',
  logger = require(rootPrefix + '/lib/customConsoleLogger'),
  coreConstants = require(rootPrefix + '/config/coreConstants');

const sequelizeInstances = {};

class SequelizeProvider {
  static getInstance(dbName, enableXRay = true) {
    if (!sequelizeInstances[dbName]) {
      sequelizeInstances[dbName] = {};
    }

    if (sequelizeInstances[dbName][enableXRay]) {
      return sequelizeInstances[dbName][enableXRay];
    }

    const connectionOptions = {
      host: coreConstants.DB_HOST,
      port: coreConstants.DB_PORT,
      dialect: 'postgres',
      pool: {
        max: Number(coreConstants.DB_CONNECTION_POOL_SIZE || 5),
        idle: 30000,
        acquire: 10000
      },
      benchmark: true,
      logging: (sql, timingMs) => logger.info(`${sql.replace(/\s+/g, ' ').trim()} - [Execution time: ${timingMs}ms]`)
    };

    sequelizeInstances[dbName][enableXRay] = new Sequelize(
      dbName,
      coreConstants.DB_USER,
      coreConstants.DB_PASSWORD,
      connectionOptions
    );

    return sequelizeInstances[dbName][enableXRay];
  }
}

module.exports = SequelizeProvider;

// Connection pooling using sequelize https://sequelize.org/docs/v6/other-topics/connection-pool/
