import { nanoid } from "nanoid";
import { InvalidIdentityValueException } from "../identity.exceptions";

/**
 * A class representing a nanoid value.
 */
export class NanoId {
	/**
	 * The value of the nanoid.
	 */
	private value: string;

	/**
	 * Constructs a new instance of the NanoId class.
	 * @param nanoGuid Optional string value to use as the nanoid. If not provided, a new one will be generated.
	 * @throws InvalidIdentityValueException if the provided nanoid is not valid.
	 */
	constructor(nanoGuid?: string) {
		if (nanoGuid) {
			if (!NanoId.isValid(nanoGuid))
				throw new InvalidIdentityValueException(nanoGuid, "NanoGuid");
		} else {
			nanoGuid = nanoid();
		}

		this.value = nanoGuid;
	}

	/**
	 * Gets the primitive value of the nanoid.
	 * @returns The string value of the nanoid.
	 */
	protected get primitiveValue(): string {
		return this.value;
	}

	/**
	 * Determines whether a given nanoid is valid.
	 * @param guid The nanoid to check.
	 * @returns True if the nanoid is valid, otherwise false.
	 */
	public static isValid(guid: string): boolean {
		return /[0-9a-zA-Z-_]{21}/.test(guid);
	}
}
