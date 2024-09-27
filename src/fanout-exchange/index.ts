import { connect } from "amqplib";
const queue = process.env.QUEUE || "hello";
const exchangeName = process.env.EXCHANGE || "gobbo-exchange";
const exchangeType = "fanout";

console.log({
  queue,
  exchangeName,
});

async function subscriber() {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue(queue);

  await channel.assertExchange(exchangeName, exchangeType);

  await channel.bindQueue(queue, exchangeName, 'gobbo.rolificador.events');

  channel.consume(queue, (message) => {
    const content = JSON.parse(message.content.toString());

    console.log(`Received message from "${queue}" queue`);
    console.log(content);

    channel.ack(message);
  });
}

subscriber().catch((error) => {
  console.error(error);
  process.exit(1);
});
