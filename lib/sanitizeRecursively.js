const sanitizeHtml = require('sanitize-html');
const rootPrefix = '..',
  logger = require(rootPrefix + '/lib/customConsoleLogger');
/**
 * Class for sanitizing params recursively.
 *
 * @module lib/sanitizeRecursively
 */
class SanitizeRecursively {
  /**
   * Recursively sanitize params.
   *
   * @param {any} params - Params to be sanitized.
   * @returns {any} - Sanitized params.
   */
  sanitizeParamsRecursively(params) {
    const oThis = this;

    if (typeof params === 'string') {
      params = oThis._sanitizeString(params);
    } else if (typeof params === 'boolean' || typeof params === 'number' || params === null) {
      // Do nothing and return param as is.
    } else if (params instanceof Array) {
      for (const index in params) {
        params[index] = oThis.sanitizeParamsRecursively(params[index]);
      }
    } else if (params instanceof Object) {
      Object.keys(params).forEach(function (key) {
        params[key] = oThis.sanitizeParamsRecursively(params[key]);
      });
    } else if (!params) {
      params = oThis._sanitizeString(params);
    } else {
      logger.error('Invalid params type: ', typeof params);
      params = '';
    }

    return params;
  }

  /**
   * Sanitize string.
   *
   * @param {string} str - String to be sanitized.
   * @returns {string} - Sanitized string.
   * @private
   */
  _sanitizeString(str) {
    const sanitizedHtmlStr = sanitizeHtml(str, { allowedTags: [] });

    return sanitizedHtmlStr.replace(/javascript:/g, '');
  }
}

module.exports = new SanitizeRecursively();
