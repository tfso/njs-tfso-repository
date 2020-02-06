import { Operator } from './operator';
export declare class OrderByOperator<TEntity> extends Operator<TEntity> {
    private property;
    constructor(property: keyof TEntity | ((it: TEntity) => void));
    evaluate(items: Iterable<TEntity>): IterableIterator<TEntity>;
    evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<TEntity>;
}
