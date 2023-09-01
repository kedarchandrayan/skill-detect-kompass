class ErrorCodeConstants {
  /**
   * Unauthorized
   *
   * @returns {string}
   */
  get unauthorized() {
    return 'UNAUTHORIZED';
  }

  /**
   * Bad request
   *
   * @returns {string}
   */
  get badRequest() {
    return 'BAD_REQUEST';
  }

  /**
   * Forbidden
   *
   * @returns {string}
   */
  get forbidden() {
    return 'FORBIDDEN';
  }

  /**
   * Not found
   *
   * @returns {string}
   */
  get notFound() {
    return 'NOT_FOUND';
  }

  /**
   * Internal server error
   *
   * @returns {string}
   */
  get internalServerError() {
    return 'INTERNAL_SERVER_ERROR';
  }

  /**
   * HTTP code by error code
   *
   * @returns {object}
   */
  get httpCodeByErrorCode() {
    const oThis = this;

    return {
      [oThis.unauthorized]: 401,
      [oThis.badRequest]: 400,
      [oThis.forbidden]: 403,
      [oThis.notFound]: 404,
      [oThis.internalServerError]: 500
    };
  }
}

module.exports = new ErrorCodeConstants();
