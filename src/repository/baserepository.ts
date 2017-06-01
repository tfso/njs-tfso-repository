import { IFilterCriteria, FilterCriteria } from './filters/filtercriteria';
import Enumerable, { IEnumerable, IEnumerableOptions } from './../linq/enumerable';
import { WhereOperator } from './../linq/operators/whereoperator';

import { IRecordSetMeta } from './db/recordset';

import { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './../linq/expressions/logicalexpression';

export { IEnumerable, IRecordSetMeta }

export interface IBaseRepository<TEntity, TEntityId> {
    create(entity: TEntity, meta?: IRecordSetMeta): Promise<TEntity>

    read(id: TEntityId, meta?: IRecordSetMeta): Promise<TEntity>
    readAll(query: IEnumerable<TEntity>, meta?: IRecordSetMeta): Promise<TEntity[]>

    update(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>
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

    abstract read(id: TEntityId): Promise<TEntity>
    abstract read(id: TEntityId, meta?: IRecordSetMeta): Promise<TEntity>

    // ((t) => t.gender == 'female' && t.age >= 16)({gender: 'female', age: 17})     => true
    // ((t) => t.gender == 'female' && t.age >= 16).toString()                       => (t) => t.gender == \'female\' && t.age >= 16
    abstract readAll(query: IEnumerable<TEntity>): Promise<TEntity[]>
    abstract readAll(query: IEnumerable<TEntity>, meta?: IRecordSetMeta): Promise<TEntity[]>
    abstract readAll(query: IEnumerable<TEntity>, meta?: IRecordSetMeta, parent?: IParentOptions): Promise<TEntity[]>

    abstract create(entity: TEntity): Promise<TEntity>
    abstract create(entity: TEntity, meta?: IRecordSetMeta): Promise<TEntity>

    abstract update(entity: TEntity): Promise<boolean>
    abstract update(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>

    abstract delete(entity: TEntity): Promise<boolean>
    abstract delete(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>

    public beginTransaction(): Promise<void> {
        return Promise.resolve();
    }

    public commitTransaction(): Promise<void> {
        return Promise.resolve();
    }

    public rollbackTransaction(): Promise<void> {
        return Promise.resolve();
    }

    protected getCriteria(query: IEnumerable<TEntity>): FilterCriteria[] 
    protected getCriteria(expressions: ILogicalExpression[]): FilterCriteria[]
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

    private async * asyncIterator(options?: IEnumerableOptions<TEntity>, meta?: IRecordSetMeta): AsyncIterableIterator<TEntity> {
        if (!options) options = {};

        yield* await this.readAll(options.query || null, meta, { query: options['parent'], keyProperty: options['keyProperty'], keys: options['keys'] });
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

