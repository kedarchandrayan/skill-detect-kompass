/**
 * Async process constants
 *
 * @module lib/globalConstant/asyncProcess
 * @class AsyncProcessConstants
 */
class AsyncProcessConstants {
  /**
   * Task splitter task kind
   *
   * @returns {string}
   */
  get taskSplitterTaskKind() {
    return 'task_splitter';
  }

  /**
   * Rover task kind
   *
   * @returns {string}
   */
  get roverTaskKind() {
    return 'rover';
  }
}

module.exports = new AsyncProcessConstants();
