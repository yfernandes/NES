import * as amqp from "amqplib";

import { IMessageTransport } from "../";

const debug = require("debug")("nes:messages");

export class RabbitMQTransport implements IMessageTransport {
	public listen(topic: string, handler: (msg: any) => void): void {
		throw new Error("Method Not Implemented");
	}

	public send(topic: string, message: any): void {
		throw new Error("Method Not Implemented");
	}

	mockHandler(msg: amqp.ConsumeMessage) {
		console.log(`[*] Received: ${msg.content.toString()}`);
	}

	public async subscribe(
		topic = "logs",
		handler: (msg: any) => void = this.mockHandler
	): Promise<void> {
		try {
			const connection = await amqp.connect("amqp://localhost");

			// check work_queues_with_pre_fetch

			const channel = await connection.createChannel();
			await channel.assertExchange(topic, "fanout", { durable: false });

			const queue = await channel.assertQueue("", { exclusive: true });

			await channel.bindQueue(queue.queue, topic, "");

			await channel.consume(
				queue.queue,
				(msg) => handler(JSON.parse(msg.content.toString())),
				{ noAck: true } // check branch work_queues_message_acknowledgment
			);
		} catch (error) {
			console.log("ERR:", error);
		}
	}

	public async publish(
		topic = "logs",
		message: any = "Hello World!"
	): Promise<void> {
		try {
			const connection = await amqp.connect("amqp://localhost:5672");

			const channel = await connection.createChannel();

			await channel.assertExchange(topic, "fanout", { durable: false });

			channel.publish(topic, "", Buffer.from(JSON.stringify(message)));

			setTimeout(() => {
				connection.close();
			}, 50);
		} catch (error) {
			console.log("ERR:", error);
		}
	}
}
