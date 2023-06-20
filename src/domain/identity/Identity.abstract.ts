import { IIdentity } from "./Identity.interface";

/**
 * Represents an Identity type, which is a base type for creating strongly-typed Ids.
 *
 * @template TId The type of the Id value.
 */
export abstract class Identity<TId> implements IIdentity<TId> {
	/**
	 * Creates a new Identity instance with the specified id value.
	 *
	 * @param {TId} _value The id value.
	 */
	constructor(protected _value: TId) {}

	/**
	 * Returns the value of the private member variable _value.
	 *
	 * @return {TId} The value of the private member variable _value.
	 */
	get value(): TId {
		return this._value;
	}

	/**
	 * Determines if this Identity instance is equal to another.
	 *
	 * @param {IIdentity<TId>} other - The Identity instance to compare to.
	 * @return {boolean} Returns true if the two instances are equal, false otherwise.
	 */
	public equals(other: IIdentity<TId>): boolean {
		return this === other || this._value === other._value;
	}

	/**
	 * Returns a string representation of the value stored in the private _value field.
	 *
	 * @return {string} The string representation of the value.
	 */
	public toString(): string {
		return this._value.toString();
	}

	/**
	 * Returns the value of the Id.
	 *
	 * @returns {TId} The value of the Id.
	 */
	public valueOf(): TId {
		return this._value;
	}

	/**
	 * Returns a JSON representation of the Id.
	 *
	 * @returns {string} A string representation of the Id.
	 */
	public toJSON(): string {
		return this.toString();
	}
}
