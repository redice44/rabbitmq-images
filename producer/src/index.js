const ampq = require('amqplib');
const fs = require('fs');
const queue = process.env.RABBITMQ_QUEUE;

const imageFileSource = './src/image.png';
const image = fs.readFileSync(imageFileSource);
const { RABBITMQ_USER, RABBITMQ_PASS, RABBITMQ_URL } = process.env;

const connect = async () => {
  try {
    const connection = await ampq.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_URL}`);
    const channel = await connection.createConfirmChannel();
    try {
      await channel.assertQueue(queue);
    } catch (error) {
      console.log('assertQueue', error);
      process.exit(1);
    }
    channel.sendToQueue(queue, Buffer.from(image));
    try {
      await channel.waitForConfirms();
      console.log('Buffer Sent');
      connection.close();
      process.exit(0);
    } catch (error) {
      console.log('waitForConfirms', error);
      process.exit(1);
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('Trying again in 1 second...');
      setTimeout(connect, 1000);
    } else if (error.code === 'ECONNRESET') {
      console.log('Connection closed');
      process.exit(0);
    } else {
      console.log('Exiting on erroror', err);
      process.exit(1);
    }
  }
};

connect();
