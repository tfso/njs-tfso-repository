import { Operator } from './operator';
export declare class OrderByOperator<TEntity> extends Operator<TEntity> {
    property: string | number | symbol;
    constructor(property: string | keyof TEntity | ((it: TEntity) => void));
    evaluate(items: Iterable<TEntity>): IterableIterator<TEntity>;
    evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<TEntity>;
}
