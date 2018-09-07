import { Operator } from './operator';
export declare class SelectOperator<TEntity> extends Operator<TEntity> {
    selector: (it: TEntity) => {};
    constructor(selector: (it: TEntity) => {});
    evaluate(items: Iterable<TEntity>): IterableIterator<any>;
    evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<any>;
}
