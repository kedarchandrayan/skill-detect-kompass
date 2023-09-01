const rootPrefix = '../..',
  logger = require(rootPrefix + '/lib/customConsoleLogger'),
  standardResponse = require(rootPrefix + '/lib/standardResponse');

/**
 * Base Class for Services
 *
 * @class ServicesBase
 *
 */
class ServicesBase {
  /**
   * Constructor for services base.
   * All the services classes would extend this class.
   *
   * @constructor
   */
  constructor() {
    const oThis = this;
  }

  /**
   * Main performer for class.
   *
   * @return {promise<result>}
   *
   */
  async perform() {
    const oThis = this;

    try {
      return oThis._asyncPerform();
    } catch (err) {
      let errorObject = err;

      if (!standardResponse.isKnown(err)) {
        errorObject = standardResponse.error('a_s_b_1', { error: err.toString(), stack: err.stack });
      }

      logger.error(' Error debug data:', JSON.stringify(errorObject.debugOptions));

      return errorObject;
    }
  }

  /**
   * Async perform.
   *
   * @private
   * @returns {Promise<void>}
   */
  async _asyncPerform() {
    throw new Error('Sub-class to implement.');
  }

  /**
   * Error
   *
   * @param errorId
   * @param debugOptions
   * @param message
   * @param code
   * @returns {Promise<never>}
   * @private
   */
  _error (errorId, debugOptions, message, code) {
    return Promise.reject (standardResponse.error(errorId, debugOptions, message, code));
  }
}

module.exports = ServicesBase;
