import { FilterCriteria } from './filters/filtercriteria';
import { IEnumerable, IEnumerableOptions } from './../linq/enumerable';
import { IRecordSetMeta } from './db/recordset';
import { ILogicalExpression } from './../linq/expressions/logicalexpression';
export { IEnumerable, IRecordSetMeta };
export interface IBaseRepository<TEntity, TEntityId> {
    create(entity: TEntity, meta?: IRecordSetMeta): Promise<TEntity>;
    read(id: TEntityId, meta?: IRecordSetMeta): Promise<TEntity>;
    readAll(query: IEnumerable<TEntity>, meta?: IRecordSetMeta): Promise<TEntity[]>;
    update(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>;
    delete(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>;
}
export interface IParentOptions {
    query?: IEnumerable<any>;
    keyProperty?: string;
    keys?: Array<any>;
}
declare abstract class BaseRepository<TEntity, TEntityId> implements IBaseRepository<TEntity, TEntityId>, AsyncIterable<TEntity> {
    constructor();
    abstract read(id: TEntityId): Promise<TEntity>;
    abstract read(id: Partial<TEntityId>): Promise<TEntity>;
    abstract read(id: TEntityId, meta?: IRecordSetMeta): Promise<TEntity>;
    abstract read(id: Partial<TEntityId>, meta?: IRecordSetMeta): Promise<TEntity>;
    abstract read(id: TEntityId, meta?: IRecordSetMeta): Promise<TEntity>;
    abstract readAll(query: IEnumerable<TEntity>): Promise<TEntity[]>;
    abstract readAll(query: IEnumerable<TEntity>, meta?: IRecordSetMeta): Promise<TEntity[]>;
    abstract readAll(query: IEnumerable<TEntity>, meta?: IRecordSetMeta, parent?: IParentOptions): Promise<TEntity[]>;
    abstract create(entity: TEntity): Promise<TEntity>;
    abstract create(entity: Partial<TEntity>): Promise<TEntity>;
    abstract create(entity: TEntity, meta?: IRecordSetMeta): Promise<TEntity>;
    abstract create(entity: Partial<TEntity>, meta?: IRecordSetMeta): Promise<TEntity>;
    abstract create(entity: Partial<TEntity>, meta?: IRecordSetMeta): Promise<TEntity>;
    abstract update(entity: TEntity): Promise<boolean>;
    abstract update(entity: Partial<TEntity>): Promise<boolean>;
    abstract update(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>;
    abstract update(entity: Partial<TEntity>, meta?: IRecordSetMeta): Promise<boolean>;
    abstract update(entity: Partial<TEntity>, meta?: IRecordSetMeta): Promise<boolean>;
    abstract delete(entity: TEntity): Promise<boolean>;
    abstract delete(entity: Partial<TEntity>): Promise<boolean>;
    abstract delete(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>;
    abstract delete(entity: Partial<TEntity>, meta?: IRecordSetMeta): Promise<boolean>;
    abstract delete(entity: Partial<TEntity>, meta?: IRecordSetMeta): Promise<boolean>;
    beginTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;
    protected isQueryPageable(query: IEnumerable<TEntity>): boolean;
    protected getCriteriaGroups(query: IEnumerable<TEntity>): Array<FilterCriteria[]>;
    protected getCriteria(query: IEnumerable<TEntity>): FilterCriteria[];
    protected getCriteria(expressions: ILogicalExpression[]): FilterCriteria[];
    /**
     * Async iterable iterator that has the same signature as readAll, may be overridden to support query through pages.
     * Method is protected since it's primary used by getIterable or [Symbol.asyncIterator]
     * @param query
     * @param meta
     */
    protected query(query: IEnumerable<TEntity>, meta?: IRecordSetMeta, parent?: IParentOptions): AsyncIterableIterator<TEntity>;
    private asyncIterator;
    getIterable(meta?: IRecordSetMeta): AsyncIterable<TEntity>;
    [Symbol.asyncIterator]: (options?: IEnumerableOptions<TEntity>) => AsyncIterableIterator<TEntity>;
}
export default BaseRepository;
