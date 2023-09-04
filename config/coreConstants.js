/**
 * Core constants for the application.
 *
 * @module config/coreConstants
 * @exports CoreConstants
 */
class CoreConstants {
  /**
   * Indicates the current environment (e.g., local, develop, staging, production, test)
   *
   * @returns {string}
   */
  get ENVIRONMENT() {
    return process.env.STR_ENVIRONMENT;
  }

  /**
   * Suffix to differentiate database instances for different environments
   *
   * @returns {string}
   */
  get DB_SUFFIX() {
    return process.env.STR_DB_SUFFIX;
  }

  /**
   * Specifies the size of the connection pool for the database.
   *
   * @returns {string}
   */
  get DB_CONNECTION_POOL_SIZE() {
    return process.env.STR_DB_CONNECTION_POOL_SIZE;
  }

  /**
   * Hostname or IP address of the database server.
   *
   * @returns {string}
   */
  get DB_HOST() {
    return process.env.STR_DB_HOST;
  }

  /**
   * Name of the default database to connect to.
   *
   * @returns {string}
   */
  get DEFAULT_DB() {
    return process.env.STR_DEFAULT_DB;
  }

  /**
   * Port number for the database connection.
   *
   * @returns {string}
   */
  get DB_PORT() {
    return process.env.STR_DB_PORT;
  }

  /**
   * Username used to authenticate with the database.
   *
   * @returns {string}
   */
  get DB_USER() {
    return process.env.STR_DB_USER;
  }

  /**
   * Password used to authenticate with the database.
   *
   * @returns {string}
   */
  get DB_PASSWORD() {
    return process.env.STR_DB_PASSWORD;
  }

  /**
   * Prefix for keys used in caching data.
   *
   * @returns {string}
   */
  get CACHE_KEY_PREFIX() {
    return process.env.STR_CACHE_KEY_PREFIX;
  }

  /**
   * Address of the Memcached server for caching.
   *
   * @returns {string}
   */
  get MEMCACHED_SERVER_ADDRESS() {
    return process.env.STR_MEMCACHED_SERVER_ADDRESS;
  }

  /**
   * RabbitMQ Host
   *
   * @returns {string}
   */
  get RABBITMQ_HOST() {
    return process.env.STR_RABBITMQ_HOST;
  }

  /**
   * RabbitMQ Port
   *
   * @returns {number}
   */
  get RABBITMQ_PORT() {
    return process.env.STR_RABBITMQ_PORT;
  }

  /**
   * RabbitMQ Username
   *
   * @returns {string}
   */
  get RABBITMQ_USERNAME() {
    return process.env.STR_RABBITMQ_USERNAME;
  }

  /**
   * RabbitMQ Password
   *
   * @returns {string}
   */
  get RABBITMQ_PASSWORD() {
    return process.env.STR_RABBITMQ_PASSWORD;
  }

  /**
   * Base URL of the API for the application.
   *
   * @returns {string}
   */
  get API_BASE_URL() {
    return process.env.STR_API_BASE_URL;
  }
}

module.exports = new CoreConstants();
