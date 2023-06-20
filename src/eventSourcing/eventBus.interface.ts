import { IMessageBus } from "../messaging/messageBus.interface";
import { IEvent } from "./event.interface";

/**
 * Interface for an event bus that extends the IMessageBus interface and has a generic type constraint of IEvent or a subtype of IEvent.
 */
export interface IEventBus<EventBase extends IEvent = IEvent>
	extends IMessageBus<EventBase> {
	/**
	 * Publishes a single event of type T.
	 * @param event The event to publish.
	 */
	// publish<T extends EventBase>(event: T);
	/**
	 * Publishes an array of events.
	 * @param events The events to publish.
	 */
	// publishAll(events: EventBase[]);
}
