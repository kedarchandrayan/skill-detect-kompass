/**
 * This middleware is used to assign params to req.decodedParams and req.internalDecodedParams
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 *
 * @returns {Promise<void>}
 *
 */
class AssignParamsToRequest {
  /**
   * Assign params
   *
   * @param {object} req
   * @param {object} res
   * @param {object} next
   *
   * @returns {Promise<void>}
   */
  assignParams(req, res, next) {
    // Assign params to req.decodedParams
    // Following are the usual conventions:
    // POST, PUT, and PATCH request methods usually pass parameters in the request body, not in the query parameters.
    // GET requests have parameters in the query, and request bodies are not allowed for GET requests.
    // DELETE requests use the route to identify parameters, and neither request bodies nor query parameters are needed.
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      req.decodedParams = req.body || {};
    } else if (req.method === 'GET') {
      req.decodedParams = req.query || {};
    } else if (req.method === 'DELETE') {
      req.decodedParams = {};
    }

    // Internal decoded params are used for internal purpose only, initialising it to empty object
    req.internalDecodedParams = {};

    next();
  }
}

module.exports = new AssignParamsToRequest();
