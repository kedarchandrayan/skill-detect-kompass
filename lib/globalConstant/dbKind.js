/**
 * DBKind is a class that defines the db kind.
 *
 * @module lib/globalConstant/dbKind
 * @class DbKind
 */
class DbKind {
  /**
   * Get string for sql db kind.
   *
   * @returns {string}
   */
  get sqlDbKind() {
    return 'sql';
  }
}

module.exports = new DbKind();
