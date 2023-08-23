import { Injectable } from "@nestjs/common";
import * as EventStoreClient from "node-eventstore-client";
// TODO: Find another solution to replace @tokilabs/lang
import { Type, requireByFQN, deserialize } from "@tokilabs/lang";

import { AggregateRoot } from "../../domain";
import { EventEnvelope, IEvent } from "../";
import { IEventStore } from ".";
import { Constants } from "../../symbols";
import { IIdentity } from "../../domain/identity/Identity.interface";
import { UUID } from "../../domain/identity/providers/UUID";
import { NanoId } from "../../domain/identity/providers/NanoId";
import { UUIDIdentity } from "../../domain/identity/GuidIdentity";
import logger from "../../utils/logger";

@Injectable()
export class EventStoreDB implements IEventStore {
	constructor(
		private readonly client = EventStoreClient,
		private host: string = "localhost",
		private port: number = 1113,
		private settings: EventStoreClient.ConnectionSettings = {}
	) {}

	public async save<
		TId extends UUID | NanoId,
		T extends AggregateRoot<IIdentity<TId>>
	>(aggregate: T): Promise<number> {
		return await this.saveEvents(
			aggregate.constructor,
			aggregate.id,
			aggregate.uncommittedChanges,
			aggregate.version
		).then((results) =>
			results.reduce<number>((r, c) => c.nextExpectedVersion, -1)
		);
	}

	public async getEventsByAggregate(
		aggregateType: Type,
		aggregateId: IIdentity<UUID | NanoId>
	): Promise<EventEnvelope[]> {
		const events: EventEnvelope[] = [];
		let currentSlice: EventStoreClient.StreamEventsSlice;
		let nextSliceStart = 0;
		const streamName = this.getStreamName(aggregateType, aggregateId);

		const conn = await this.connect();

		logger.info(`nes:eventStoreDB:: Reading events stream ${streamName}`);

		do {
			currentSlice = await conn.readStreamEventsForward(
				streamName,
				nextSliceStart,
				200
			);
			nextSliceStart = currentSlice.nextEventNumber;

			events.push(...currentSlice.events.map((e) => this.convertToEnvelope(e)));
		} while (!currentSlice.isEndOfStream);
		conn.close();
		logger.info(`nes:eventStoreDB:: Got the ${events.length} events`);
		return events;
	}

	private convertToEnvelope(
		event: EventStoreClient.ResolvedEvent
	): EventEnvelope {
		const e = event.event;
		const metadata = JSON.parse(e.metadata.toString());
		const eventClass = requireByFQN(e.eventType);

		return new EventEnvelope(
			new UUIDIdentity(e.eventId),
			metadata.aggregateType, // aggregateType
			metadata.aggregateId, // aggregateId
			e.eventNumber, // version
			e.eventType, // eventType
			deserialize(eventClass, e.data.toString()), // eventData
			metadata,
			new Date(e.createdEpoch) // created
		);
	}

	private saveEvents<TId extends IIdentity<UUID | NanoId>>(
		aggregateType: Type,
		aggregateId: TId,
		events: IEvent[],
		expectedVersion: number
	): Promise<EventStoreClient.WriteResult[]> {
		if (!events || events.length === 0)
			throw new Error("Parameter events cannot be null or empty");

		const streamName = this.getStreamName(aggregateType, aggregateId);

		const eventsData = events.map((evt) => {
			const evtData = this.client.createJsonEventData(
				new UUID().toString(),
				evt,
				{
					aggregateType: aggregateType.name,
					aggregateId: aggregateId.toString(),
				},
				Reflect.getMetadata(Constants.EventFQN, evt.constructor)
			);
			return evtData;
		});

		logger.info(`nes:eventStoreDB:: Saving events to stream ${streamName}`);

		let nextVersion = expectedVersion;

		return this.withConn<EventStoreClient.WriteResult[]>(
			(connection): Promise<EventStoreClient.WriteResult[]> =>
				eventsData.reduce(
					async (agg, event): Promise<EventStoreClient.WriteResult[]> => {
						return agg.then(
							async (results): Promise<EventStoreClient.WriteResult[]> => {
								return await connection
									.appendToStream(streamName, nextVersion, event)
									.then((result): EventStoreClient.WriteResult[] => {
										nextVersion = result.nextExpectedVersion;
										results.push(result);
										return results;
									});
							}
						);
					},
					Promise.resolve([])
				)
		);
	}

	private async getEvents(
		streamName: string,
		start: number,
		limit = 4096
	): Promise<EventStoreClient.StreamEventsSlice> {
		return await this.withConn<EventStoreClient.StreamEventsSlice>(
			async (conn) =>
				await conn.readStreamEventsForward(streamName, start, limit)
		);
	}

	private async withConn<T>(
		func: (conn: EventStoreClient.EventStoreNodeConnection) => Promise<T>
	): Promise<T> {
		const connection = await this.connect();
		const res = await func(connection);
		connection.close();
		return res;
	}

	private async connect(): Promise<EventStoreClient.EventStoreNodeConnection> {
		const conn = this.client.createConnection(
			this.settings,
			`tcp://${this.host}:${this.port}`
		);

		return await conn.connect().then(() => conn);
	}

	private getStreamName<TId extends IIdentity<UUID | NanoId>>(
		type: Type,
		id: TId
	): string {
		return `${type.name}-${id.toString()}`;
	}
}
