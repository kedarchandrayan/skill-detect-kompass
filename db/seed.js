const { Sequelize } = require('sequelize');

const rootPrefix = '..',
  databaseConstants = require(rootPrefix + '/lib/globalConstant/database'),
  coreConstants = require(rootPrefix + '/config/coreConstants'),
  logger = require(rootPrefix + '/lib/customConsoleLogger'),
  SequelizeProvider = require(rootPrefix + '/lib/providers/Sequelize');

const mainDbName = databaseConstants.mainDbName;
class CreateSchemaMigrationTable {
  /**
   * Perform
   * @returns {Promise<void>}
   */
  async perform() {
    const oThis = this;

    // create main db
    await oThis._createMainDB();

    // create schema migration table
    await oThis._createSchemaMigrationTable();
  }

  /**
   * Create main db
   *
   * @returns {Promise<void>}
   *
   * @private
   */
  async _createMainDB() {
    // creating connection without db name

    const connectionOptions = {
      host: coreConstants.DB_HOST,
      port: coreConstants.DB_PORT,
      dialect: 'postgres',
      pool: {
        max: 1,
        idle: 30000,
        acquire: 10000
      },
      benchmark: true,
      logging: (sql, timingMs) => logger.info(`${sql.replace(/\s+/g, ' ').trim()} - [Execution time: ${timingMs}ms]`)
    };

    const sequelize = new Sequelize(
      coreConstants.DEFAULT_DB,
      coreConstants.DB_USER,
      coreConstants.DB_PASSWORD,
      connectionOptions
    );

    const query = `SELECT 1 FROM pg_database WHERE datname = '${mainDbName}';`;
    const databaseExists = await sequelize.query(query);

    if (databaseExists[1].rowCount > 0) {
      logger.log(`Database '${mainDbName}' already exists.`);
      await sequelize.close();
      return;
    }

    const createDbQuery =
      `CREATE DATABASE ${mainDbName}\n` +
      "WITH ENCODING='UTF8'\n" +
      "LC_COLLATE='C'\n" +
      "LC_CTYPE='C'\n" +
      "TEMPLATE='template0';";

    await sequelize.query(createDbQuery);

    // close connection
    await sequelize.close();
  }

  /**
   * Create schema migration table
   *
   * @returns {Promise<void>}
   *
   * @private
   */
  async _createSchemaMigrationTable() {
    const createSchemaMigrationTableQuery =
      'CREATE TABLE IF NOT EXISTS schema_migrations (\n' +
      '  version varchar(255) NOT NULL,\n' +
      '  PRIMARY KEY (version)\n' +
      ');';

    // disable xray for this query as we are creating the table during code build
    const enableXRay = false;

    await SequelizeProvider.getInstance(mainDbName, enableXRay).query(createSchemaMigrationTableQuery);
  }
}

// Check if the script is being run directly
if (require.main === module) {
  // If executed as a standalone script
  new CreateSchemaMigrationTable()
    .perform()
    .then(() => {
      logger.log('Schema migration table created successfully.');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Error creating schema migration table:', err);
      process.exit(1);
    });
} else {
  // If imported as a module
  module.exports = new CreateSchemaMigrationTable();
}
