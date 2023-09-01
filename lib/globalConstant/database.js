const rootPrefix = '../..',
  coreConstants = require(rootPrefix + '/config/coreConstants');

const dbNamePrefix = 'str_api',
  dbNameSuffix = '_' + coreConstants.DB_SUFFIX;

/**
 * Class for database constants.
 *
 * @class Database
 */
class Database {
  /**
   * Main database name
   *
   * @returns {string}
   */
  get mainDbName() {
    return dbNamePrefix + dbNameSuffix;
  }
}

module.exports = new Database();
