const rootPrefix = '..',
  logger = require(rootPrefix + '/lib/customConsoleLogger'),
  errorCodeConstants = require(rootPrefix + '/lib/globalConstant/error/code'),
  coreConstants = require(rootPrefix + '/config/coreConstants'),
  errorMessageConstants = require(rootPrefix + '/lib/globalConstant/error/message');

/**
 * Custom success response class
 */
class CustomSuccess {
  /**
   * Constructor
   * @param {Object} data - Data to be sent in response
   * @constructor
   */
  constructor(data) {
    data = data || {};

    const oThis = this;

    oThis.data = data;
  }

  /**
   * Log the response
   */
  log() {
    const oThis = this;

    logger.log(oThis);
  }

  /**
   * Is success
   *
   * @returns {boolean}
   */
  isSuccess() {
    return true;
  }

  /**
   * Render the response
   *
   * @param {*} res
   * @returns
   */
  render(res) {
    const oThis = this;

    return res.status(200).json({
      success: true,
      data: oThis.data
    });
  }
}

/**
 * Custom error response class
 */
class CustomError {
  /**
   * Constructor
   *
   * @param {*} errorId
   * @param {*} debugOptions
   * @param {*} message
   * @param {*} code
   * @constructor
   */
  constructor(errorId, debugOptions, message, code) {
    debugOptions = debugOptions || {};
    message = message || errorMessageConstants.somethingWentWrong;
    code = code || errorCodeConstants.internalServerError;

    const oThis = this;

    oThis.errorId = errorId;
    oThis.debugOptions = debugOptions;
    oThis.message = message;
    oThis.code = code;

    //oThis.log();
  }

  /**
   * Log the response
   */
  log() {
    const oThis = this;
    logger.error(oThis);
  }

  /**
   * Is success
   *
   * @returns {boolean}
   */
  isSuccess() {
    return false;
  }

  /**
   * Render the response
   *
   * @param {*} res
   * @returns
   */
  render(res) {
    const oThis = this;

    // Get http code from error code
    const httpCode = errorCodeConstants.httpCodeByErrorCode[oThis.code];

    // Ana asked to hide the un-necessary details in error messages in production environment.
    if (
      coreConstants.ENVIRONMENT === 'production' &&
      !errorMessageConstants.productionAllowedErrorMessages[oThis.message]
    ) {
      oThis.message = errorMessageConstants.somethingWentWrong;
    }

    // Render response
    return res.status(httpCode).json({
      success: false,
      error: {
        id: oThis.errorId,
        code: oThis.code,
        message: oThis.message
      }
    });
  }
}

/**
 * Standard response class
 *
 * @module lib/standardResponse
 */
class StandardResponse {
  /**
   * Success response
   *
   * @param {*} data
   * @returns instance of CustomSuccess
   */
  success(data) {
    return new CustomSuccess(data);
  }

  /**
   * Error response
   *
   * @param {*} errorId
   * @param {*} debugOptions
   * @param {*} message
   * @param {*} code
   * @returns instance of CustomError
   */
  error(errorId, debugOptions, message, code) {
    return new CustomError(errorId, debugOptions, message, code);
  }

  /**
   * Is known
   *
   * @param {*} obj
   * @returns boolean
   */
  isKnown(obj) {
    return obj instanceof CustomSuccess || obj instanceof CustomError;
  }

  /**
   * Error code constants getter
   *
   * @returns {any}
   */
  get errorCode() {
    return errorCodeConstants;
  }

  /**
   * Error message constants getter
   *
   * @returns {any}
   */
  get errorMessage() {
    return errorMessageConstants;
  }
}

module.exports = new StandardResponse();
