const amqp = require('amqplib');

const rootPrefix = '../..',
  coreConstants = require(rootPrefix + '/config/coreConstants');

let connection = null,
  channel = null;

class MessageBroker {
  async getInstance() {
    if(channel && connection) {
      return {channel, connection};
    }

    connection = await amqp.connect(`amqp://${coreConstants.RABBITMQ_USERNAME}:${coreConstants.RABBITMQ_PASSWORD}@${coreConstants.RABBITMQ_HOST}:${coreConstants.RABBITMQ_PORT}`);

    channel = await connection.createChannel();
    await channel.assertQueue('task_queue', { durable: true });

    return {channel, connection};
  }

  async close() {
    await channel.close();
    await connection.close();

    connection = null;
    channel = null;
  }
}

module.exports = new MessageBroker();
