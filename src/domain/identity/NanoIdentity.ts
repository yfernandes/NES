import { Identity } from "./Identity.abstract";
import { NanoId } from "./providers/NanoId";

/**
 * Represents a unique identifier using a NanoId.
 */
export class NanoIdentity extends Identity<NanoId> {
	/**
	 * Instantiates a new NanoGuidIdentity with a given guid.
	 * @param guid The guid to use for this identity.
	 */
	constructor(guid?: string) {
		super(new NanoId(guid));
	}

	/**
	 * Returns a string representation of this identity.
	 * @returns A string representation of this identity.
	 */
	public toString(): string {
		return this.value.toString();
	}

	/**
	 * Returns a string representation of this identity, suitable for serialization.
	 * @returns A string representation of this identity.
	 */
	public toJSON(): string {
		return this.toString();
	}
}
