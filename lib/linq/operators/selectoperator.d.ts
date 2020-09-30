import { Operator } from './operator';
export declare class SelectOperator<TEntity> extends Operator<TEntity> {
    private selector;
    constructor(selector: string | ((it: TEntity) => {}));
    evaluate(items: Iterable<TEntity>): IterableIterator<any>;
    evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<any>;
}
