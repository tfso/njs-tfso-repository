import { IFilters, Filters } from './filters/filters';
import Enumerable, { IEnumerable } from './../linq/enumerable';
import { WhereOperator } from './../linq/operators/whereoperator';


export { IEnumerable }

export interface IBaseRepository<TEntity, TEntityId> {
    create(entity: TEntity): Promise<TEntity>

    read(id: TEntityId): Promise<TEntity>
    readAll(query: IEnumerable<TEntity>): Promise<TEntity[]>

    update(entity: TEntity): Promise<boolean>
    delete(entity: TEntity): Promise<boolean>
}

abstract class BaseRepository<TEntity, TEntityId> implements IBaseRepository<TEntity, TEntityId>
{
    constructor() {

    }

    abstract read(id: TEntityId): Promise<TEntity>

    // ((t) => t.gender == 'female' && t.age >= 16)({gender: 'female', age: 17})     => true
    // ((t) => t.gender == 'female' && t.age >= 16).toString()                       => (t) => t.gender == \'female\' && t.age >= 16

    abstract readAll(query: IEnumerable<TEntity>): Promise<TEntity[]>

    abstract create(entity: TEntity): Promise<TEntity>
    abstract update(entity: TEntity): Promise<boolean>
    abstract delete(entity: TEntity): Promise<boolean>


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
        let predicate: (it: TEntity, ...params: any[]) => boolean = (entity) => true,
            parameters: any[] = [];

        for (let operator of query.operations.values())
            if (operator instanceof WhereOperator) {
                predicate = (<WhereOperator<TEntity>>operator).predicate;
                parameters = (<WhereOperator<TEntity>>operator).parameters;

                break;
            }

        return new Filters<TEntity>(predicate, ...parameters);
    }

    public getPredicateFn(query: IEnumerable<TEntity>): (element: TEntity) => boolean {
        let predicate: (it: TEntity, ...params: any[]) => boolean = (entity) => true,
            parameters: any[] = [];

        for (let operator of query.operations.values())
            if (operator instanceof WhereOperator) {
                predicate = (<WhereOperator<TEntity>>operator).predicate;
                parameters = (<WhereOperator<TEntity>>operator).parameters;

                break;
            }

        return (entity: TEntity) => {
            return (predicate == null) ? true : predicate.apply({}, [entity].concat(parameters));
        };
    }
}

export default BaseRepository

