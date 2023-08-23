/**
 * Base class for implementing Value Objects
 *
 * Value Object is a Domain Driven Design concept for an object
 * whose identity is determined by it's properties values.
 *
 * Value objects MUST:
 * - Be immutable
 * - Be compared by value-equality
 *
 * @export
 * @class ValueObject
 */
export class ValueObject<TObject> {
	/**
	 * @param construct Your value object's constructor
	 * @param constructParams Name of the properties to pass to constructor IN ORDER
	 */
	constructor(
		private construct: new (...args: any[]) => TObject,
		private constructorParameters: (keyof TObject)[]
	) {}

	/**
	 * Checks whether this ValueObject is equal to another ValueObject.
	 *
	 * @param {ValueObject<TObject>} other - the ValueObject to compare to
	 * @return {boolean} true if this ValueObject is equal to the other, false otherwise
	 */
	public equals(other: ValueObject<TObject>): boolean {
		return !this.constructorParameters.some((prop) => {
			return (this as any)[prop] !== (other as any)[prop];
		});
	}
	/**
	 * Creates a new instance of the current object with updated properties.
	 *
	 * @param {Partial<TObject>} updatedProps - An object containing updated properties.
	 * @return {TObject} - A new instance of the current object with the updated properties.
	 */
	protected newInstanceWith(updatedProps: Partial<TObject>): TObject {
		const parameters = this.constructorParameters.map((p) =>
			Object.prototype.hasOwnProperty.call(updatedProps, p)
				? updatedProps[p]
				: (this as any)[p]
		);

		return new this.construct(...parameters);
	}
}
