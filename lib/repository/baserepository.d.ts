import { IFilters } from './filters/filters';
import { IEnumerable } from './../linq/enumerable';
import { IRecordSetMeta } from './db/recordset';
export { IEnumerable, IRecordSetMeta };
export interface IBaseRepository<TEntity, TEntityId> {
    create(entity: TEntity, meta?: IRecordSetMeta): Promise<TEntity>;
    read(id: TEntityId, meta?: IRecordSetMeta): Promise<TEntity>;
    readAll(query: IEnumerable<TEntity>, meta?: IRecordSetMeta): Promise<TEntity[]>;
    update(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>;
    delete(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>;
}
declare abstract class BaseRepository<TEntity, TEntityId> implements IBaseRepository<TEntity, TEntityId> {
    constructor();
    abstract read(id: TEntityId): Promise<TEntity>;
    abstract read(id: TEntityId, meta?: IRecordSetMeta): Promise<TEntity>;
    abstract readAll(query: IEnumerable<TEntity>): Promise<TEntity[]>;
    abstract readAll(query: IEnumerable<TEntity>, meta?: IRecordSetMeta): Promise<TEntity[]>;
    abstract create(entity: TEntity): Promise<TEntity>;
    abstract create(entity: TEntity, meta?: IRecordSetMeta): Promise<TEntity>;
    abstract update(entity: TEntity): Promise<boolean>;
    abstract update(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>;
    abstract delete(entity: TEntity): Promise<boolean>;
    abstract delete(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>;
    beginTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;
    /**
     * returns a IFilters if the predicate is solvable, otherwise it throws an error
     * @param predicate
     * @param parameters
     */
    protected getFilters(query: IEnumerable<TEntity>): IFilters;
    getPredicateFn(query: IEnumerable<TEntity>): (element: TEntity) => boolean;
}
export default BaseRepository;
