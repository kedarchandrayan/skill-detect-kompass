/**
 * Constants needed for Message Broker
 *
 * @module lib/globalConstant/messageBroker
 * @class MessageBroker
 */
class MessageBroker {
  /**
   * Queue name
   *
   * @returns {string}
   */
  get queueName() {
    return 'task_queue';
  }
}

module.exports = new MessageBroker();
