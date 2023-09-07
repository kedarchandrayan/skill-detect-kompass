const BigNumber = require('bignumber.js');
const { validate } = require('uuid');
const url = require('url');

const rootPrefix = '../..',
  missionConstants = require(rootPrefix + '/lib/globalConstant/model/mission');

/**
 * Class for common validators.
 *
 * @class CommonValidator
 */
class CommonValidator {
  /**
   * Is var undefined?
   *
   * @param variable
   *
   * @returns {boolean}
   */
  static isVarUndefined(variable) {
    return typeof variable === 'undefined';
  }

  /**
   * Is var null or undefined?
   *
   * @param variable
   * @returns {boolean}
   */
  static isVarNullOrUndefined(variable) {
    return typeof variable === 'undefined' || variable == null;
  }

  /**
   * Is string valid ?
   * @param variable
   * @returns {boolean}
   */
  static validateString(variable) {
    return typeof variable === 'string';
  }

  /**
   * Validate non empty object.
   *
   * @param {object} variable
   *
   * @returns {boolean}
   */
  static validateNonEmptyObject(variable) {
    if (CommonValidator.isVarNullOrUndefined(variable) || typeof variable !== 'object') {
      return false;
    }

    for (const prop in variable) {
      try {
        if (Object.prototype.hasOwnProperty.call(variable, prop)) {
          return true;
        }
      } catch (error) {
        return false;
      }
    }

    return false;
  }

  /**
   * Is valid Boolean?
   *
   * @returns {boolean}
   */
  static validateBoolean(variable) {
    const oThis = this;

    return typeof variable === 'boolean';
  }

  /**
   * Is var integer?
   *
   * @returns {boolean}
   */
  static validateInteger(variable) {
    const variableInBn = new BigNumber(String(variable));
    // Variable is integer and its length is less than 37 digits
    return variableInBn.isInteger() && variableInBn.toString(10).length <= 37;
  }

  /**
   * Is var natural number (should be integer and greater than 0)?
   *
   * @returns {boolean}
   */
  static validateNaturalNumber(variable) {
    const cThis = this;

    if (!cThis.validateInteger(variable)) return false;

    return variable > 0;
  }

  /**
   * Validate string array
   *
   * @param {array<string>} array
   *
   * @returns {boolean}
   */
  static validateStringArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateString(array[index])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Validate UUID
   *
   * @param {string} uuid
   *
   * @returns {boolean}
   */
  static validateUUID(uuid) {
    return validate(uuid);
  }

  /**
   * Validate non-empty string
   *
   * @param {string} str
   *
   * @returns {boolean}
   */
  static validateNonEmptyString(str) {
    return this.validateString(str) && str.trim() !== '';
  }

  /**
   * Validate url
   *
   * @param url
   * @returns {boolean}
   */
  static validateUrl(url) {
    return /^(http(s)?:\/\/)?([a-z0-9-_]{1,256}\.)+[a-z]{2,15}\b([a-z0-9@:%_+.\[\]\-{}!' ",~#?&;/=*]*)$/i.test(url);
  }

  /**
   * Is variable to be a array of non empty strings
   *
   * @param {array<string>} variable
   *
   * @returns {boolean}
   */
  static validateNonEmptyStringArray(variable) {
    if (!Array.isArray(variable)) {
      return false;
    }

    for (const element of variable) {
      if (!CommonValidator.validateNonEmptyString(element)) {
        return false;
      }
    }

    return true;
  }

  static validateURL(inputURL) {
    try {
      const parsedURL = new URL(inputURL);
      return true;
    } catch (error) {
      return false;
    }
  }

  static validateFloatValue(input) {
    // Convert the input to a floating-point number
    const floatValue = parseFloat(input);

    // Check if the input is a valid number and less than 10
    if (!isNaN(floatValue) && floatValue <= 10) {
      return true; // The input is valid
    }

    return false; // The input is not valid
  }
}

module.exports = CommonValidator;
