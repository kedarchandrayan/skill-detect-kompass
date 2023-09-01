const crypto = require('crypto');

const rootPrefix = '..',
  logger = require(rootPrefix + '/lib/customConsoleLogger');

/**
 * Class for basic helper methods.
 *
 * @class BasicHelper
 */
class BasicHelper {
  /**
   * Sleep for particular time.
   *
   * @param {number} ms: time in ms
   *
   * @returns {Promise<any>}
   */
  sleep(ms) {
    // eslint-disable-next-line no-console
    logger.log(`Sleeping for ${ms} ms.`);

    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  /**
   * Create a duplicate object.
   *
   * @param {object} obj
   * @return {object}
   */
  deepDup(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Converts the given string to camel case
   * @param {string} value
   * @returns {string}
   */
  convertToCamelCase(value) {
    if (typeof value === 'string') {
      return value.toLowerCase().replace(/(_\w)/g, function (match) {
        // Convert to upper case and ignore the first char (=the underscore)
        return match.toUpperCase().substring(1);
      });
    }
    return value;
  }

  /**
   * Return a string value for any data type.
   *
   * @param {any} value
   * @return {string}
   */
  convertToString(value) {
    if (typeof value === 'string') {
      return value; // Already a string, no conversion needed
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      return value.toString(); // Convert numbers and booleans to strings
    } else if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value); // Convert objects to JSON strings
    } else {
      return String(value); // Fallback: convert using the String() constructor
    }
  }

  /**
   * Checks whether the object is empty or not.
   *
   * @param {object} obj
   *
   * @return {boolean}
   */
  isEmptyObject(obj) {
    for (const property in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, property)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Invert JSON.
   *
   * @param {object} obj
   *
   * @returns {object}
   */
  invert(obj) {
    const ret = {};

    for (const key in obj) {
      ret[obj[key]] = key;
    }

    return ret;
  }
}

module.exports = new BasicHelper();
