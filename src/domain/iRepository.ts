import { IEntity } from "./entity";
import { IAggregateRoot } from "./aggregateRoot";

// Define a symbol that represents the IRepositoryOf interface
export const IRepositoryOf = Symbol("IRepositoryOf");

/**
 * An interface for defining a repository that works with entities
 * @typeparam TAggregate The type of entity this repository works with
 * @typeparam TId The type of the entity's ID
 */
export interface IRepositoryOf<TAggregate extends IEntity<TId>, TId> {
	/**
	 * Gets an entity by its ID
	 * @param id The ID of the entity to get
	 * @returns A Promise that resolves to the entity with the given ID
	 */
	getById(id: TId): Promise<TAggregate>;

	/**
	 * Saves an entity to the repository
	 * @param aggregate The entity to save
	 */
	save(aggregate: TAggregate): void;
}

// Define a symbol that represents the IRepository interface
export const IRepository = Symbol("IRepository");

/**
 * An interface for defining a repository that works with aggregate roots
 * @typeparam TAggregate The type of aggregate root this repository works with
 * @typeparam TId The type of the aggregate root's ID
 */
export interface IRepository<TAggregate extends IAggregateRoot, TId> {
	/**
	 * Gets an aggregate root by its ID
	 * @param id The ID of the aggregate root to get
	 * @returns A Promise that resolves to the aggregate root with the given ID
	 */
	getById(id: TId): Promise<TAggregate>;

	/**
	 * Saves an aggregate root to the repository
	 * @param aggregateRoot The aggregate root to save
	 */
	save(aggregate: TAggregate): void;
}
