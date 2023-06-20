import { Type } from "@nestjs/common";

import { IMessage, IMessageHandler, IMessageTransport } from "./";

/**
 * Represents a type for a message handler that handles messages of a specific type.
 * @template MessageBase - The base message type that this handler operates on.
 */
export type MessageHandlerType<MessageBase extends IMessage = IMessage> = Type<
	IMessageHandler<MessageBase>
>;

/**
 * Represents a message bus that can send and receive messages of a specific type.
 * @template MessageType The type of messages that can be sent and received by the bus.
 */
export interface IMessageBus<MessageType> {
	/**
	 * The transport mechanism used by the message bus to send and receive messages.
	 */
	transport: IMessageTransport;

	/**
	 * Publishes a message to the message bus.
	 * @param message The message to be published.
	 * @returns A promise that resolves when the message has been successfully published.
	 */
	publish<T extends MessageType>(message: T): Promise<any>;

	/**
	 * Registers one or more message handlers with the message bus.
	 * @param handlers An array of message handlers to be registered.
	 * @param constant A symbol indicating the type of messages that the handlers are capable of handling.
	 */
	register(handlers: MessageHandlerType[], constant: symbol): void;
}
