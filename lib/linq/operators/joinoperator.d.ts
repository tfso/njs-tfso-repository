import { IEnumerable } from './../enumerable';
import { Operator } from './operator';
export declare enum JoinType {
    Inner = 0,
    Left = 1
}
export declare class JoinOperator<TEntity, TInner, TResult> extends Operator<TResult> {
    private joinType;
    private selector;
    private indexing;
    private outerProperty;
    private innerProperty;
    constructor(joinType: JoinType, outerKey: (a: TEntity) => void, innerKey: (b: TInner) => void, selector: (a: TEntity, b: IEnumerable<TInner>) => TResult, indexing?: boolean);
    private getPropertyName;
    getOuterKey(outerItem: TEntity): any;
    getInnerKey(innerItem: TInner): any;
    evaluate(outer: Iterable<TEntity>, inner: Iterable<TInner>): IterableIterator<TResult>;
    evaluateAsync(outer: AsyncIterable<TEntity>, inner: AsyncIterable<TInner>): AsyncIterableIterator<TResult>;
}
