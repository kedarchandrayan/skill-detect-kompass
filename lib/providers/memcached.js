const Cache = require('@truesparrow/unicache');

const rootPrefix = '../..',
  cacheManagementConstants = require(rootPrefix + '/lib/globalConstant/cacheManagement'),
  coreConstants = require(rootPrefix + '/config/coreConstants'),
  logger = require(rootPrefix + '/lib/customConsoleLogger');

// Declare variables.
const cacheInstanceMap = {};

/**
 * Class for shared memcache provider.
 *
 * @class CacheProvider
 */
class CacheProvider {
  /**
   * Get instance of in memory cache.
   *
   * @param {number} cacheConsistentBehavior
   *
   * @returns {Promise<*>}
   */
  async getInstance(cacheConsistentBehavior) {
    let cacheObject = cacheInstanceMap[cacheConsistentBehavior];
    if (cacheObject) {
      return cacheObject;
    }

    const cacheConfigStrategy = {
      engine: cacheManagementConstants.memcached,
      servers: [coreConstants.MEMCACHED_SERVER_ADDRESS],
      defaultTtl: 36000,
      consistentBehavior: cacheConsistentBehavior
    };

    cacheObject = Cache.getInstance(cacheConfigStrategy);

    const cacheImplementer = cacheObject.cacheInstance;

    cacheImplementer.client.on('issue', async function (details) {
      const errorMessage = 'Server ' + details.server + ' seems to be down: ' + details.messages.join('');
      logger.error(errorMessage);
    });

    await cacheImplementer.set('dummyWarmupKey', 'dummyWarmupValue', 600);

    cacheInstanceMap[cacheConsistentBehavior] = cacheObject;

    return cacheObject;
  }
}

module.exports = new CacheProvider();
