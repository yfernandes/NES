import { Identity } from "./Identity.abstract";

export class IntIdentity extends Identity<number> {
	constructor(value: number) {
		super(value);
	}
}

export class StringIdentity extends Identity<string> {
	constructor(value: string) {
		super(value);
	}
}
