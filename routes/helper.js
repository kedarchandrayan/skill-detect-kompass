const rootPrefix = '..',
  ApiParamsValidator = require(rootPrefix + '/lib/validators/ApiParams'),
  standardResponse = require(rootPrefix + '/lib/standardResponse'),
  logger = require(rootPrefix + '/lib/customConsoleLogger');

/**
 * Class representing a routes helper base.
 * All the routes helper classes would extend this class.
 *
 * @class RoutesHelper
 */
class RoutesHelper {
  /**
   * Constructor
   * @param {object} params
   * @param {object} params.req - request object
   * @param {object} params.res - response object
   * @param {string} params.servicePath - service path
   * @param {function} params.onServiceSuccess - function to be called on service success
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

    oThis.params = params || {};

    oThis.req = oThis.params.req || {};
    oThis.res = oThis.params.res || {};
    oThis.servicePath = oThis.params.servicePath || null;
    oThis.onServiceSuccess = oThis.params.onServiceSuccess || null;

    oThis.errorCode = null;
    oThis.req.decodedParams = oThis.req.decodedParams || {};
    oThis.req.internalDecodedParams = oThis.req.internalDecodedParams || {};
    oThis.serviceParams = null;
    oThis.response = null;
  }

  /**
   * Main performer for class.
   *
   * @returns {Promise<void>}
   */
  async perform() {
    const oThis = this;

    try {
      await oThis._getErrorCode();

      await oThis._validateApiParams();

      await oThis._callService();

      return oThis._handleResponse();
    } catch (error) {
      let errorObject = error;
      logger.error('Error in routes helper base:  ', errorObject);
      if (standardResponse.isKnown(errorObject)) {
        oThis._renderResponse(errorObject, oThis.res);
      } else {
        errorObject = standardResponse.error('r_h_b_1', { error: error.toString(), stack: error.stack });

        oThis._renderResponse(errorObject, oThis.res);
      }
    }
  }

  /**
   * Get error code.
   *
   * @sets oThis.errorCode
   *
   * @returns {Promise<void>}
   * @private
   */
  async _getErrorCode() {
    const oThis = this;

    oThis.errorCode = oThis.servicePath
      .split('/')
      .filter((part) => part.length > 0)
      .map((part) => part.charAt(0))
      .join('_')
      .toLowerCase();

    logger.log('error code:  ', oThis.errorCode);
  }

  /**
   * Validate API params.
   *
   * @sets oThis.serviceParams
   *
   * @returns {Promise<void>}
   * @private
   */
  async _validateApiParams() {
    const oThis = this;

    const apiParamsValidatorRsp = await new ApiParamsValidator({
      apiName: oThis.req.internalDecodedParams.api_name,
      apiVersion: oThis.req.internalDecodedParams.api_version,
      externalParams: oThis.req.decodedParams,
      internalParams: oThis.req.internalDecodedParams
    }).perform();

    oThis.serviceParams = apiParamsValidatorRsp.data.sanitisedApiParams;
  }

  /**
   * Handle response
   *
   * @return {Promise<*>}
   * @private
   */
  async _handleResponse() {
    const oThis = this;

    if (oThis.response.isSuccess()) {
      if (oThis.onServiceSuccess) {
        oThis.response = await oThis.onServiceSuccess(oThis.response);
      } else {
        oThis.response = standardResponse.success({});
      }
    }

    return oThis._renderResponse(oThis.response, oThis.res);
  }

  /**
   * Call service and return response.
   *
   * @sets oThis.response
   *
   * @returns {Promise<*>}
   * @private
   */
  async _callService() {
    const oThis = this;

    const Service = require(rootPrefix + oThis.servicePath);

    oThis.response = await new Service(oThis.serviceParams).perform();
  }

  /**
   * Render response.
   *
   * @param {object} standardResponse
   * @param {object} res
   *
   * @private
   * @returns {object}
   */
  _renderResponse(standardResponse, res) {
    return standardResponse.render(res);
  }
}

module.exports = RoutesHelper;
