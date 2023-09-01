const rootPrefix = '..',
  sanitizeRecursively = require(rootPrefix + '/lib/sanitizeRecursively');

/**
 * Class for sanitizing params.
 *
 * @module helpers/middlewares/sanitizer
 */
class Sanitizer {
  /**
   * Sanitize Request body and request query params.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {*} - The result of the next middleware.
   */
  sanitizeBodyAndQuery(req, res, next) {
    req.body = sanitizeRecursively.sanitizeParamsRecursively(req.body);
    req.query = sanitizeRecursively.sanitizeParamsRecursively(req.query);

    return next();
  }

  /**
   * Sanitize dynamic params in URL.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {*} - The result of the next middleware.
   */
  sanitizeDynamicUrlParams(req, res, next) {
    req.params = sanitizeRecursively.sanitizeParamsRecursively(req.params);

    return next();
  }

  /**
   * Sanitize headers.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {*} - The result of the next middleware.
   */
  sanitizeHeaderParams(req, res, next) {
    req.sanitizedHeaders = sanitizeRecursively.sanitizeParamsRecursively(req.headers);
    req.internalDecodedParams.headers = req.sanitizedHeaders;

    return next();
  }

  /**
   * Sanitize object.
   *
   * @param {Object} params - The object to be sanitized.
   * @returns {Object} - The sanitized object.
   */
  sanitizeParams(params) {
    return sanitizeRecursively.sanitizeParamsRecursively(params);
  }
}

module.exports = new Sanitizer();
