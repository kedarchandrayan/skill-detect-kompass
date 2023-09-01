const rootPrefix = '../..',
  coreConstants = require(rootPrefix + '/config/coreConstants');

/**
 * Class for cache management constants.
 *
 * @class CacheManagementConstants
 */
class CacheManagementConstants {
  /**
   * Get in memory cache type.
   *
   * @returns {string}
   */
  get inMemory() {
    return 'in_memory';
  }

  get memcached() {
    return 'memcached';
  }

  /**
   * Get cache key prefix.
   *
   * @returns {string}
   */
  get keyPrefix() {
    return `${coreConstants.CACHE_KEY_PREFIX}`;
  }

  /**
   * Get large expiry time interval as one day.
   *
   * @returns {number}
   */
  get largeExpiryTimeInterval() {
    return 86400;
  }

  /**
   * Get max expiry time interval as thirty days.
   *
   * @returns {number}
   */
  get maxExpiryTimeInterval() {
    return 2592000;
  }
}

module.exports = new CacheManagementConstants();
