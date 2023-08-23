import { Inject, Injectable } from "@nestjs/common";

import { IMessageTransport, MessageBus } from "../messaging";
import { Constants } from "../symbols";
import { IEvent, IEventBus } from ".";
import { ModuleRef } from "@nestjs/core";

@Injectable()
export class EventBus extends MessageBus<IEvent> implements IEventBus {
	constructor(
		@Inject(Constants.MessageTransporter) transport: IMessageTransport,
		@Inject(Constants.ModuleRef) moduleRef: ModuleRef
	) {
		super("EventBus", transport, moduleRef);
	}
}
