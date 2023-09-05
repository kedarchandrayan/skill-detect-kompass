const express = require('express');
const router = express.Router();

const rootPrefix = '..',
  logger = require(rootPrefix + '/lib/customConsoleLogger'),
  standardResponse = require(rootPrefix + '/lib/standardResponse'),
  databaseConstants = require(rootPrefix + '/lib/globalConstant/database'),
  memcachedProvider = require(rootPrefix + '/lib/providers/memcached'),
  SequelizeProvider = require(rootPrefix + '/lib/providers/Sequelize'),
  missionRoutes = require(rootPrefix + '/routes/missions/index');

// Heartbeat route
router.get('/heartbeat', async function (req, res) {
  try {
    // Check database connectivity
    const sequelize = SequelizeProvider.getInstance(databaseConstants.mainDbName);
    await sequelize.authenticate();
  } catch (error) {
    logger.error(error);
    return standardResponse.error('r_i_1', { db_error: error.message }).render(res);
  }

  try {
    // Check cache connectivity
    const cacheObject = await memcachedProvider.getInstance('1');
    const cacheImplementer = cacheObject.cacheInstance;
    const cacheResponse = await cacheImplementer.get('heartbeat-test123');
    if (!cacheResponse.isSuccess()) {
      return standardResponse.error('r_i_2').render(res);
    }
  } catch (error) {
    logger.error(error);
    return standardResponse.error('r_i_3').render(res);
  }

  // Both database and cache are accessible. Return success.
  return standardResponse
    .success({
      db_status: 1,
      cache_status: 1
    })
    .render(res);
});

// All the missions routes are prefixed with /missions
router.use('/missions', missionRoutes);

module.exports = router;
