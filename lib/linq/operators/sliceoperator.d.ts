import { Operator } from './operator';
export declare class SliceOperator<TEntity> extends Operator<TEntity> {
    begin: number | any;
    end: number;
    constructor(begin: number | any, end: number);
    evaluate(items: Iterable<TEntity>): IterableIterator<TEntity>;
    evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<TEntity>;
}
