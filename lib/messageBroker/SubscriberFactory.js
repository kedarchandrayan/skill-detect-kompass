const rootPrefix = '../..',
  messageBrokerConstants = require(rootPrefix + '/lib/globalConstant/messageBroker.js'),
  messageBrokerProvider = require(rootPrefix + '/lib/providers/messageBroker'),
  asyncProcessConstants = require(rootPrefix + '/lib/globalConstant/asyncProcess'),
  logger = require(rootPrefix + '/lib/customConsoleLogger');

class SubscriberFactory {
  /**
   * Start processing
   *
   * @returns {Promise<void>}
   */
  async static startProcessing() {
    logger.log(' [*] Waiting for tasks. To exit, press CTRL+C');

    const {channel, connection} = await messageBrokerProvider.getInstance();

    channel.consume(messageBrokerConstants.queueName, async (msg) => {
      const taskJSON = msg.content.toString();
      logger.log(` [x] Received task: ${taskJSON}`);

      let parsedTask = null;
      try {
        parsedTask = JSON.parse(taskJSON);

        switch (parsedTask.kind) {
          case asyncProcessConstants.taskSplitterTaskKind:
            const TaskSplitter = require(rootPrefix + '/lib/asyncProcess/TaskSplitter');

            await new TaskSplitter(parsedTask.payload).perform();

            break;

          case asyncProcessConstants.roverTaskKind:
            const Rover = require(rootPrefix + '/lib/asyncProcess/Rover');

            await new Rover(parsedTask.payload).perform();

            break;

          default:
            logger.error('Unknown async task kind:', parsedTask.kind);
        }

        // Acknowledge the message
        channel.ack(msg);
      } catch (e) {
        console.error(e);

        // Acknowledge the message
        channel.ack(msg);
      }

    }, { noAck: false });
  }
}

if (require.main === module) {
  // If executed as a standalone script

  SubscriberFactory
    .startProcessing()
    .then(() => {
      logger.log('Exiting successfully.');

      process.exit(0);
    })
    .catch((err) => {
      logger.error('Exiting with error:', err);

      process.exit(1);
    });
} else {
  module.exports = SubscriberFactory;
}
