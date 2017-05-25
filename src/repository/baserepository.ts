import { IFilters, Filters } from './filters/filters';
import Enumerable, { IEnumerable } from './../linq/enumerable';
import { WhereOperator } from './../linq/operators/whereoperator';

import { IRecordSetMeta } from './db/recordset';

export { IEnumerable, IRecordSetMeta }

export interface IBaseRepository<TEntity, TEntityId> {
    create(entity: TEntity, meta?: IRecordSetMeta): Promise<TEntity>

    read(id: TEntityId, meta?: IRecordSetMeta): Promise<TEntity>
    readAll(query: IEnumerable<TEntity>, meta?: IRecordSetMeta): Promise<TEntity[]>

    update(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>
    delete(entity: TEntity, meta?: IRecordSetMeta): Promise<boolean>
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

    /**
     * returns a IFilters if the predicate is solvable, otherwise it throws an error
     * @param predicate
     * @param parameters
     */
    protected getFilters(query: IEnumerable<TEntity>): IFilters {
        let expression: any;

        for (let operator of query.operations.values())
            if (operator instanceof WhereOperator) {
                expression = operator.expression;

                break;
            }

        return new Filters<TEntity>(expression);
    }

    public getPredicateFn(query: IEnumerable<TEntity>): (element: TEntity) => boolean {
        let expression: any;

        for (let operator of query.operations.values())
            if (operator instanceof WhereOperator) {
                return operator.predicate;
            }

        return (entity: TEntity) => {
            return true;
        };
    }

    private async * asyncIterator(query?: IEnumerable<TEntity>, parent?: IEnumerable<any>): AsyncIterableIterator<TEntity> {
        yield* await this.readAll(query);
    }

    [Symbol.asyncIterator] = (query?: IEnumerable<TEntity>, parent?: IEnumerable<any>) => {
        return this.asyncIterator(query, parent);
    }
}

export default BaseRepository

