import { IFilterCriteria, FilterCriteria } from './filters/filtercriteria';
import Enumerable, { IEnumerable, IEnumerableOptions } from './../linq/enumerable';
import { OperatorType } from './../linq/operators/operator';
import { WhereOperator } from './../linq/operators/whereoperator';

import { IRecordSetMeta } from './db/recordset';

import { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './../linq/expressions/logicalexpression';

export { IEnumerable, IRecordSetMeta }

export interface IBaseRepository<TEntity, TEntityId> {
    create(entity: TEntity, meta?: IRecordSetMeta): Promise<TEntity | null>
    create(entity: Partial<TEntity>, meta?: IRecordSetMeta): Promise<TEntity | null>
    create<T extends TEntity>(entity: T, meta?: IRecordSetMeta): Promise<T | null>

    read(id?: TEntityId, meta?: IRecordSetMeta): Promise<TEntity | null>
    readAll(query: IEnumerable<TEntity>, meta?: IRecordSetMeta): Promise<TEntity[]>

    update(entity: Partial<TEntity>, meta?: IRecordSetMeta): Promise<TEntity | boolean | null>
    delete(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>
}

export interface IParentOptions {
    query?: IEnumerable<any>
    keyProperty?: string
    keys?: Array<any>
}

abstract class BaseRepository<TEntity, TEntityId> implements IBaseRepository<TEntity, TEntityId>, AsyncIterable<TEntity>
{
    constructor() {

    }

    abstract read(id?: TEntityId, meta?: IRecordSetMeta): Promise<TEntity | null>
    abstract read(id?: Partial<TEntityId>, meta?: IRecordSetMeta): Promise<TEntity | null>
    
    // ((t) => t.gender == 'female' && t.age >= 16)({gender: 'female', age: 17})     => true
    // ((t) => t.gender == 'female' && t.age >= 16).toString()                       => (t) => t.gender == \'female\' && t.age >= 16
    abstract readAll(query?: IEnumerable<TEntity>, meta?: IRecordSetMeta, parent?: IParentOptions): Promise<TEntity[]>

    abstract create(entity: TEntity, meta?: IRecordSetMeta): Promise<TEntity | null>
    abstract create(entity: Partial<TEntity>, meta?: IRecordSetMeta): Promise<TEntity | null>
    
    abstract update(entity: TEntity, meta?: IRecordSetMeta): Promise<TEntity | boolean | null>
    abstract update(entity: Partial<TEntity>, meta?: IRecordSetMeta): Promise<TEntity | boolean | null>
    
    abstract delete(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>
    abstract delete(entity: Partial<TEntity>, meta?: IRecordSetMeta): Promise<boolean>

    public beginTransaction(): Promise<void> {
        return Promise.resolve();
    }

    public commitTransaction(): Promise<void> {
        return Promise.resolve();
    }

    public rollbackTransaction(): Promise<void> {
        return Promise.resolve();
    }

    protected isQueryPageable(query?: IEnumerable<TEntity>): boolean {
        if(query == null)
            return true 
        
        let where = query.operations.first(OperatorType.Where);

        if (where)
            return where.getExpressionCount() == where.getExpressionIntersection().length;

        return true;
    }

    protected getCriteriaGroups(query?: IEnumerable<TEntity>): Array<FilterCriteria[]> {
        if(query instanceof Enumerable) 
        {
            for (let operator of query.operations.values())
                if (operator instanceof WhereOperator) {
                    return Array
                        .from((<WhereOperator<TEntity>>operator).getExpressionGroups())
                        .map(group => Array
                            .from(group)
                            .map(expr => new FilterCriteria(expr))
                        )
                }
        }

        return [];
    }

    protected getCriteria(query?: IEnumerable<TEntity>): FilterCriteria[] 
    protected getCriteria(expressions?: ILogicalExpression[]): FilterCriteria[]
    protected getCriteria() {
        if(arguments[0] instanceof Enumerable) 
        {
            for (let operator of arguments[0].operations.values())
                if (operator instanceof WhereOperator) 
                    return (<WhereOperator<TEntity>>operator).getExpressionIntersection().map(expr => new FilterCriteria(expr));
        }

        if(Array.isArray(arguments[0]))
            return arguments[0].map(expr => new FilterCriteria(expr))

        return [];
    }

    /**
     * Async iterable iterator that has the same signature as readAll, may be overridden to support query through pages. 
     * Method is protected since it's primary used by getIterable or [Symbol.asyncIterator]
     * @param query 
     * @param meta 
     */
    protected async * query(query: IEnumerable<TEntity>, meta?: IRecordSetMeta, parent?: IParentOptions): AsyncIterableIterator<TEntity> {
        yield* await this.readAll(query, meta, parent)
    }

    private async * asyncIterator(options?: IEnumerableOptions<TEntity>, meta?: IRecordSetMeta): AsyncIterableIterator<TEntity> {
        if (!options) options = {};

        yield* await this.query(options.query || null, meta, { query: options['parent'], keyProperty: options['keyProperty'], keys: options['keys'] });
    }

    public getIterable(meta?: IRecordSetMeta): AsyncIterable<TEntity> {
        let iterable = {
            [Symbol.asyncIterator]: (options?: IEnumerableOptions<TEntity>) => {
                return this.asyncIterator(options, meta);
            }
        }

        iterable.constructor = this.constructor;

        return iterable;
    }

    [Symbol.asyncIterator] = (options?: IEnumerableOptions<TEntity>) => {
        return this.asyncIterator(options, null);
    }
}

export default BaseRepository
