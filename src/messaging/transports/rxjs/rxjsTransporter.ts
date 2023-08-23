import { IMessageTransport } from "./../iMessageTransport";
export class RxJSTransporter implements IMessageTransport {
	listen(topic: string, handler: (msg: any) => void): void {
		throw new Error("Method not implemented.");
	}

	send(topic: string, message: any): void {
		throw new Error("Method not implemented.");
	}

	subscribe(topic: string, handler: (type: string, msg: any) => void): void {
		throw new Error("Method not implemented.");
	}

	publish(topic: string, message: any) {
		throw new Error("Method not implemented.");
		return Promise.resolve({ topic, message });
	}
}
