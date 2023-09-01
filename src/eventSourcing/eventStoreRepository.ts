import { IEvent } from "./event.interface";
import { Injectable, Type } from "@nestjs/common";

import { AggregateRoot, IRepository } from "../domain/";
import { EventBus, IEventStore } from "./";
import { IIdentity } from "../domain/identity/Identity.interface";
import { NanoIdentity } from "../domain/identity/NanoIdentity";

const debug = require("debug")("nes:events:repository");

@Injectable()
export class EventStoreRepository<
	TAggregate extends AggregateRoot<TId>,
	TId extends IIdentity<any> = NanoIdentity,
> implements IRepository<TAggregate, TId>
{
	public constructor(
		protected aggregateClass: Type<TAggregate>,
		protected readonly storage: IEventStore,
		protected readonly eventBus: EventBus
	) {}

	/**
	 * Saves the given aggregate and returns a promise that resolves to an array of events.
	 *
	 * @param {TAggregate} aggregate - The aggregate to be saved.
	 * @return {Promise<IEvent[]>} A promise that resolves to an array of events.
	 */
	public save(aggregate: TAggregate): Promise<IEvent[]> {
		return this.storage.save(aggregate).then((nextVersion) => {
			const events = aggregate.uncommittedChanges.slice();

			if (this.eventBus) {
				events.map((e) => this.eventBus.publish(e));
			}

			aggregate.markChangesAsCommitted();

			return events;
		});
	}

	/**
	 * Retrieves an aggregate by its ID.
	 *
	 * @param {TId} id - The ID of the aggregate.
	 * @return {Promise<TAggregate>} A promise that resolves to the retrieved aggregate, or null if no aggregate is found.
	 */
	public async getById(id: TId): Promise<TAggregate> {
		debug(`Getting aggregate of ${this.aggregateClass.name} with id ${id}`);

		const events = await this.storage.getEventsByAggregate(
			this.aggregateClass,
			id
		);
		if (events.length === 0) return null;

		return AggregateRoot.load<TAggregate>(this.aggregateClass, events);
	}
}
