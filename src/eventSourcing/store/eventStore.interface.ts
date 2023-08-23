// TODO: Find another solution to replace @tokilabs/lang
import { Guid, NanoGuid, Type } from "@tokilabs/lang";

import { AggregateRoot } from "../../domain";
import { EventEnvelope, IEvent } from "..";
import { IIdentity } from "../../domain/identity/Identity.interface";
import { UUID } from "../../domain/identity/providers/UUID";
import { NanoId } from "../../domain/identity/providers/NanoId";

export const IEventStore = Symbol("IEventStore");
export interface IEventStore {
	/**
	 * Returns the next expected version
	 *
	 * @param {AggregateRoot<any>} aggregate
	 * @returns {Promise<number>}
	 * @memberof IEventStore
	 */
	save(aggregate: AggregateRoot<any>): Promise<number>;

	/**
	 * Retrieves all event envelopes associated with the given aggregate ID and type.
	 *
	 * @param {Type} aggregateType - The type of the aggregate to retrieve events for.
	 * @param {IIdentity<Guid | NanoGuid> | Guid | NanoGuid} aggregateId - The ID of the aggregate to retrieve events for.
	 * @return {Promise<EventEnvelope[]>} A promise that resolves with an array of event envelopes.
	 */
	getEventsByAggregate(
		aggregateType: Type,
		aggregateId: IIdentity<UUID | NanoId>
	): Promise<EventEnvelope[]>;
}
