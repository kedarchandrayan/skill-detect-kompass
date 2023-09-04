const rootPrefix = '../..',
  messageBrokerConstants = require(rootPrefix + '/lib/globalConstant/messageBroker.js'),
  messageBrokerProvider = require(rootPrefix + '/lib/providers/messageBroker');

class SubscriberBase {
  constructor() {}

  async startProcessing() {
    const oThis = this;

    console.log(' [*] Waiting for tasks. To exit, press CTRL+C');

    const {channel, connection} = await messageBrokerProvider.getInstance();

    channel.consume(messageBrokerConstants.queueName, (msg) => {
      const taskJSON = msg.content.toString();
      console.log(` [x] Received task: ${taskJSON}`);

      oThis.customProcessing(taskJSON);

      // Perform your background processing here
      // Example: Call a function to process the task
      // processTask(task);
    }, { noAck: false });
  }

  async customProcessing() {
    console.log('hello world!');
  }
}

module.exports = SubscriberBase;
