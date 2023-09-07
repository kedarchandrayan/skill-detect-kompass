const rootPrefix = '../../..';

class ErrorMessageConstants {
  /**
   * Not found
   *
   * @returns {string}
   */
  get notFound() {
    return 'Not found.';
  }

  /**
   * Unauthorized access
   *
   * @returns {string}
   */
  get unauthorizedAccess() {
    return 'Unauthorized access.';
  }

  /**
   * Something went wrong
   *
   * @returns {string}
   */
  get somethingWentWrong() {
    return 'Something went wrong.';
  }

  /**
   * Production allowed error messages
   *
   * @returns {object}
   */
  get productionAllowedErrorMessages() {
    const oThis = this;

    return {
      [oThis.unauthorizedAccess]: 1,
      [oThis.somethingWentWrong]: 1
    };
  }

  /**
   * Invalid non empty string
   *
   * @param paramName
   * @returns {string}
   */
  invalidNonEmptyString(paramName) {
    return `'${paramName}' must be a non-empty string.`;
  }
}

module.exports = new ErrorMessageConstants();
