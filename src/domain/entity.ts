// TODO: Find another solution to replace @tokilabs/lang
import { Guid, Expose, NanoGuid } from "@tokilabs/lang";
import { IIdentity } from "./identity/Identity.interface";

export const IEntity = Symbol("IEntity");
export interface IEntity<TId> {
	readonly id: TId;
}

/**
 * Abstract Base Class for Entities
 *
 * @export
 * @abstract
 * @class Entity
 * @extends {IEntity<TId>}
 * @template TId The type of this entities identity.
 */
export abstract class Entity<TId extends IIdentity<Guid | NanoGuid>>
	implements IEntity<TId>
{
	@Expose({ name: "id" })
	private _id: TId;

	constructor(id?: TId) {
		this._id = id;
	}

	/**
	 * Persistent identity value for the Entity
	 *
	 * @readonly
	 * @type {TId}
	 */
	public get id(): TId {
		return this._id;
	}

	/**
	 * Setter for the id field.
	 *
	 * @param {TId} value - The new value for the id field.
	 */
	protected set id(value: TId) {
		this._id = value;
	}
}
