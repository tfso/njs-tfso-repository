import { IFilters } from './filters/filters';
export interface IBaseRepository<TEntity, TEntityId> {
    create(entity: TEntity): Promise<TEntity>;
    read(id: TEntityId): Promise<TEntity>;
    readAll(predicate: any, ...parameters: any[]): Promise<TEntity[]>;
    update(entity: TEntity): Promise<boolean>;
    delete(entity: TEntity): Promise<boolean>;
}
declare abstract class BaseRepository<TEntity, TEntityId> implements IBaseRepository<TEntity, TEntityId> {
    constructor();
    abstract read(id: TEntityId): Promise<TEntity>;
    abstract readAll(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): Promise<TEntity[]>;
    abstract create(entity: TEntity): Promise<TEntity>;
    abstract update(entity: TEntity): Promise<boolean>;
    abstract delete(entity: TEntity): Promise<boolean>;
    beginTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;
    /**
     * returns a IFilters if the predicate is solvable, otherwise it throws an error
     * @param predicate
     * @param parameters
     */
    protected getFilters(predicate: (it: TEntity) => boolean, ...parameters: any[]): IFilters;
    getPredicateFn(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): (element: TEntity) => boolean;
}
export default BaseRepository;
