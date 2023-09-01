const rootPrefix = '..',
  SequelizeProvider = require(rootPrefix + '/lib/providers/Sequelize');

class ExecuteQuery {
  /**
   * Constructor
   *
   * @param {string} dbName - database name
   * @param {string} sql - query to execute
   * @param {boolean} enableXRay - enable xray or not
   *
   * @constructor
   */
  constructor(dbName, sql, enableXRay = true) {
    const oThis = this;

    oThis.dbName = dbName;
    oThis.sql = sql;
    oThis.enableXRay = enableXRay;
  }

  /**
   * Perform
   *
   * @returns {Promise<*>}
   */
  async perform() {
    const oThis = this;

    // Get sequelize instance
    const sequelize = SequelizeProvider.getInstance(oThis.dbName, oThis.enableXRay);

    // Run query
    return sequelize.query(oThis.sql);
  }
}

module.exports = ExecuteQuery;
