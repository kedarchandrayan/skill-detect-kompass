/**
 * Async process constants
 *
 * @module lib/globalConstant/asyncProcess
 * @class AsyncProcessConstants
 */
class AsyncProcessConstants {
  get taskSplitterTaskKind() {
    return 'task_splitter';
  }

  get roverTaskKind() {
    return 'rover';
  }
}

module.exports = new AsyncProcessConstants();
