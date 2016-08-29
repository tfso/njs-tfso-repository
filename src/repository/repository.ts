import { IFilters, Filters } from './filters/filters';

export interface IRepository<TEntity, TEntityId> {
    create(entity: TEntity): Promise<TEntity>

    read(id: TEntityId): Promise<TEntity>
    readAll(predicate: any, ...parameters: any[]): Promise<TEntity[]>

    update(entity: TEntity): Promise<boolean>
    delete(entity: TEntity): Promise<boolean>
}

export abstract class Repository<TEntity, TEntityId> implements IRepository<TEntity, TEntityId>
{
    abstract read(id: TEntityId): Promise<TEntity>

    // ((t) => t.gender == 'female' && t.age >= 16)({gender: 'female', age: 17})     => true
    // ((t) => t.gender == 'female' && t.age >= 16).toString()                       => (t) => t.gender == \'female\' && t.age >= 16
    abstract readAll(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): Promise<TEntity[]>

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
    protected getFilters(predicate: (it: TEntity) => boolean, ...parameters: any[]): IFilters {
        return new Filters<TEntity>(predicate, ...parameters);
    }

    public getPredicateFn(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): (element: TEntity) => boolean {
        return (entity: TEntity) => {
            return predicate.apply({}, [entity].concat(parameters));
        };
    }
}

