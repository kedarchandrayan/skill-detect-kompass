const rootPrefix = '../..',
  standardResponse = require(rootPrefix + '/lib/standardResponse'),
  consumerV1ApisSignature = require(rootPrefix + '/config/apiParams/consumer/v1/signature'),
  adminV1ApisSignature = require(rootPrefix + '/config/apiParams/admin/v1/signature'),
  testApisSignature = require(rootPrefix + '/test/data/lib/validators/signature'),
  apiVersions = require(rootPrefix + '/lib/globalConstant/apiVersions'),
  logger = require(rootPrefix + '/lib/customConsoleLogger'),
  CommonValidators = require(rootPrefix + '/lib/validators/Common');

/**
 * Class for API params validation. This class will validate the params sent in request.
 *
 * @class ApiParamsValidator
 *
 */
class ApiParamsValidator {
  /**
   * Constructor for API params validation.
   *
   * @param {object} params
   * @param {string} params.apiName: human readable name of API Fired - used for finding the mandatory and optional params
   * @param {object} params.externalParams: object containing params sent in request
   * @param {object} params.internalParams: object containing params set in request internally
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

    oThis.apiName = params.apiName;
    oThis.apiVersion = params.apiVersion;
    oThis.externalParams = params.externalParams;
    oThis.internalParams = params.internalParams;

    oThis.paramSignature = null;
    oThis.sanitisedApiParams = {};
  }

  /**
   * Main performer for class.
   *
   * @return {promise<result>}
   */
  async perform() {
    const oThis = this;

    oThis._logInputParameters();

    await oThis._setParamsSignature();

    await oThis._validateMandatoryParams();

    await oThis._checkOptionalParams();

    return oThis._responseData();
  }

  /**
   * Log input parameters for better debugging.
   *
   * @private
   *
   * @return {Promise<void>}
   *
   */
  _logInputParameters() {
    const oThis = this;

    const filteredExternalParams = {},
      filteredInternalParams = {};

    if (CommonValidators.validateNonEmptyObject(oThis.externalParams)) {
      for (let externalParamKey in oThis.externalParams) {
        if (oThis.sensitiveParametersMap[externalParamKey]) {
          continue;
        }
        filteredExternalParams[externalParamKey] = oThis.externalParams[externalParamKey];
      }
    }
    if (CommonValidators.validateNonEmptyObject(oThis.internalParams)) {
      for (let internalParamKey in oThis.internalParams) {
        if (oThis.sensitiveParametersMap[internalParamKey]) {
          continue;
        }
        filteredInternalParams[internalParamKey] = oThis.internalParams[internalParamKey];
      }
    }

    logger.log('EXTERNAL PARAMETERS:', JSON.stringify(filteredExternalParams));
    logger.log('INTERNAL PARAMETERS:', JSON.stringify(filteredInternalParams));
  }

  /**
   * Set params signature
   *
   * @sets oThis.paramSignature
   *
   * @returns {Promise<*>}
   * @private
   */
  async _setParamsSignature() {
    const oThis = this;

    let apisSignature = {};

    if (oThis.apiVersion === apiVersions.v1) {
      apisSignature = consumerV1ApisSignature;
    } else if (oThis.apiVersion === apiVersions.adminV1) {
      apisSignature = adminV1ApisSignature;
    } else if (oThis.apiVersion === 'test') {
      apisSignature = testApisSignature;
    }
    else {
      return Promise.reject(
        standardResponse.error('l_v_ap_fpc_1', { apiVersion: oThis.apiVersion })
      );
    }

    oThis.paramSignature = apisSignature[oThis.apiName];

    if (!oThis.paramSignature) {
      return Promise.reject(
        standardResponse.error('l_v_ap_fpc_2', { apiName: oThis.apiName })
      );
    }
  }

  /**
   * Validate mandatory params.
   *
   * @returns {Promise<never>}
   * @private
   */
  async _validateMandatoryParams() {
    const oThis = this;

    const mandatoryParamConfigs = oThis.paramSignature.mandatory || [];

    for (const paramConfig of mandatoryParamConfigs) {
      const paramName = paramConfig.parameter;

      let paramSource =
        paramConfig.kind && paramConfig.kind === 'internal'
          ? oThis.internalParams
          : oThis.externalParams;

      // Performing the mandatory check
      const isParamPresentAndHasValue = Object.prototype.hasOwnProperty.call(paramSource, paramName) &&
        !CommonValidators.isVarNullOrUndefined(paramSource[paramName]);

      if (isParamPresentAndHasValue) {
        await oThis._validateValue(paramName, paramConfig.validatorConfig, paramSource[paramName]);
      } else {

        const missingParamErrorMessage = paramConfig.missingErrorMessage || `Missing mandatory parameter: ${paramName}`;

        return Promise.reject(standardResponse.error('l_v_ap_vmp_1', {paramName}, missingParamErrorMessage, standardResponse.errorCode.badRequest));
      }
    }
  }

  /**
   * Check optional params.
   * This function will validate all the optional params sent in request.
   * If any of the optional param is invalid, it will return error.
   *
   * @private
   * @return {Promise<result>}
   *
   */
  async _checkOptionalParams() {
    const oThis = this;

    const optionalParamConfigs = oThis.paramSignature.optional || [];

    for (const paramConfig of optionalParamConfigs) {
      const paramName = paramConfig.parameter;

      const paramSource =
        paramConfig.kind && paramConfig.kind === 'internal'
          ? oThis.internalParams
          : oThis.externalParams;

      const isParamPresentAndHasValue = Object.prototype.hasOwnProperty.call(paramSource, paramName) &&
        !CommonValidators.isVarNullOrUndefined(paramSource[paramName]);

      if (isParamPresentAndHasValue) {
        await oThis._validateValue(paramName, paramConfig.validatorConfig, paramSource[paramName]);
      }
    }
  }

  /**
   * Validate the value of a parameter in accordance to the validator config
   *
   * @param paramName
   * @param validatorConfig
   * @param valueToValidate
   * @returns {Promise<never>}
   * @private
   */
  async _validateValue(paramName, validatorConfig, valueToValidate) {
    const oThis = this;

    for (const validatorMethodName in validatorConfig) {
      const errorMessage = validatorConfig[validatorMethodName] || `Invalid parameter: ${paramName}`,
        validatorMethodInstance = CommonValidators[validatorMethodName];

      if(!validatorMethodInstance) {
        return Promise.reject(standardResponse.error('l_v_ap_vv_1', {validatorMethodName}));
      }

      const isValueValid = validatorMethodInstance.apply(CommonValidators, [valueToValidate]);

      if (!isValueValid) {
        return Promise.reject(standardResponse.error('l_v_ap_vv_2', {paramName, validatorMethodName}, errorMessage, standardResponse.errorCode.badRequest));
      }
    }

    oThis.sanitisedApiParams[paramName] = valueToValidate;
  }

  /**
   * API params validation response.
   *
   * @private
   * @return {result}
   */
  async _responseData() {
    const oThis = this;

    return standardResponse.success({ sanitisedApiParams: oThis.sanitisedApiParams });
  }

  /**
   * Returns sensitive parameters map.
   * This map will be used to filter out sensitive parameters from logs.
   *
   * @returns {object}
   *
   */
  get sensitiveParametersMap() {
    // NOTE: Add sensitive parameters here.
    return {};
  }
}

module.exports = ApiParamsValidator;
