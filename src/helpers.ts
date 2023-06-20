import { Type } from "@nestjs/common";
import { IAggregateRoot } from "./domain/aggregateRoot";
import { IEvent } from "./eventSourcing";

/**
 * Returns a symbol used to create methods that handle events.
 *
 * @param {IEvent & Type} event - The event object.
 * @returns {symbol} - The symbol used to create event handling methods.
 */
export function Handle(event: IEvent & Type): symbol {
	const eventName = event.prototype.constructor.name;
	return Symbol.for(eventName);
}

/**
 * Returns a symbol used to created methods that apply events to aggregates
 *
 * @export
 * @param {(DomainEvent & Type)} e
 * @returns {symbol}
 */
export function Apply(e: IEvent & Type): symbol {
	return Symbol.for(e.prototype.constructor.name);
}

/**
 * Copies all string-indexed properties except `id` mapping prop `a` to `_a`
 *
 * This function DOES NOT copy properties whose name is a Symbol
 *
 * @param aggregate The aggregate root
 * @param event The event
 */
export function CopyPropsToUnderscoreProp(
	aggregate: IAggregateRoot,
	event: IEvent
): void {
	Reflect.ownKeys(event).forEach((k) => {
		if (typeof k === "symbol") {
			return;
		}
		aggregate[`_${k}`] = event[k];
	});
}

/**
 * Copies all string-indexed properties except `id`
 *
 * This function DOES NOT copy properties whose name is a Symbol
 *
 * @param aggregate The aggregate root
 * @param event The event
 */
export function CopyProps(aggregate: IAggregateRoot<any>, event: IEvent): void {
	Reflect.ownKeys(event).forEach((k) => {
		if (typeof k === "symbol") {
			return;
		}
		aggregate[k] = event[k];
	});
}
