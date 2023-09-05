const rootPrefix = '../..',
  messageBrokerConstants = require(rootPrefix + '/lib/globalConstant/messageBroker.js'),
  messageBrokerProvider = require(rootPrefix + '/lib/providers/messageBroker');

class TaskQueue {
  constructor() {}

  async enqueue(taskKind, payload) {
    const oThis = this;

    const taskJSON = JSON.stringify({
      kind: taskKind,
      payload: payload
    });

    const {channel, connection} = await messageBrokerProvider.getInstance();

    await channel.sendToQueue(messageBrokerConstants.queueName, Buffer.from(taskJSON), { persistent: true });
    console.log(` [x] Enqueued task: ${taskJSON}`);
  }
}

module.exports = new TaskQueue();
