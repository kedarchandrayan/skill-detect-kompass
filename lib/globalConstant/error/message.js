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
}

module.exports = new ErrorMessageConstants();
