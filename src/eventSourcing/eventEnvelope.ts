// TODO: Find another solution to replace @tokilabs/lang

import { IAggregateRoot } from "../domain";
import { UUIDIdentity } from "../domain/identity/GuidIdentity";
import { IIdentity } from "../domain/identity/Identity.interface";
import { IEvent } from "./event.interface";

// Todo: Make IEventEnvelope generic
export interface IEventEnvelope {
	readonly id: UUIDIdentity;
	readonly aggregateType: string;
	readonly aggregateId: IIdentity<any>;
	readonly aggregateVersion: number;
	/**
	 * Fully Qualified Event Name
	 *
	 * format: "[package].[class]"
	 *
	 * @type {string}
	 * @memberof IEventEnvelope
	 */
	readonly eventType: string;
	readonly event: Record<string, any>;
	readonly metadata?: Record<string, any>;
	readonly createdAt: Date;
}

/**
 * This class wraps an event to allow it to be searchable by the aggregate id, type or event type.
 *
 * This is very useful when the event is stored on a database or event store
 */
export class EventEnvelope implements IEventEnvelope {
	public readonly createdAt: Date;

	constructor(
		public readonly id: UUIDIdentity,
		public readonly aggregateType: string,
		public readonly aggregateId: IIdentity<any>,
		public readonly aggregateVersion: number,
		public readonly eventType: string,
		public readonly event: IEvent,
		public readonly metadata?: Record<string, any>,
		createdAt?: Date
	) {
		this.createdAt = createdAt || new Date();
	}

	public static wrap(
		aggregate: IAggregateRoot<any>,
		event: IEvent,
		metadata?: Record<string, any>
	): EventEnvelope {
		return new EventEnvelope(
			new UUIDIdentity(),
			String(Reflect.getMetadata(Symbol.for("FQN"), aggregate)),
			aggregate.id,
			aggregate.version,
			String(Reflect.getMetadata(Symbol.for("FQN"), event)),
			event,
			metadata,
			new Date()
		);
	}
}
