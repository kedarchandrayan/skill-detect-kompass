const rootPrefix = '../..',
  messageBrokerConstants = require(rootPrefix + '/lib/globalConstant/messageBroker.js'),
  messageBrokerProvider = require(rootPrefix + '/lib/providers/messageBroker');

class TaskQueue {
  constructor() {}

  async enqueue(task) {
    const oThis = this;

    const taskJSON = JSON.stringify(task);

    const {channel, connection} = await messageBrokerProvider.getInstance();

    await channel.sendToQueue(messageBrokerConstants.queueName, Buffer.from(taskJSON), { persistent: true });
    console.log(` [x] Enqueued task: ${taskJSON}`);
  }
}

module.exports = new TaskQueue();
