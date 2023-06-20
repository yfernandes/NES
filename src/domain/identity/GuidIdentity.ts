import { Identity } from "./Identity.abstract";
import { UUID } from "./providers/UUID";

/**
 * Represents a unique identifier using a UUID v4.
 */
export class UUIDIdentity extends Identity<UUID> {
	/**
	 * Instantiates a new UUIDIdentity with a given guid.
	 * @param guid The guid to use for this identity.
	 */
	constructor(guid?: string) {
		super(new UUID(guid));
	}

	/**
	 * Returns a string representation of this identity.
	 * @returns A string representation of this identity.
	 */
	public toString(): string {
		return this.value.toString().toUpperCase();
	}

	/**
	 * Returns a string representation of this identity, suitable for serialization.
	 * @returns A string representation of this identity.
	 */
	public toJSON(): string {
		return this.toString();
	}
}
