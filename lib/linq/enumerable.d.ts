export interface IEnumerable<TEntity> extends Iterable<TEntity> {
    /**
    * Where clause using OData $filter expression returning either true or false. Any parameters used is properties of TEntity
    * @param predicate OData expression
    */
    where(predicate: string): this;
    /**
     * Where clause using Javascript expression returning either true or false
     * @param predicate javascript expression
     * @param parameters any javascript parameters has to be declared
     */
    where(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): this;
    skip(count: number): this;
    take(count: number): this;
    first(items?: Array<TEntity>): TEntity;
    toArray(items: Array<TEntity>): Array<TEntity>;
    toArray(): Array<TEntity>;
    readonly operations: Operation<TEntity>;
}
import { Operator, OperatorType } from './operators/operator';
export { OperatorType };
export declare class Operation<TEntity> {
    private _stack;
    constructor();
    add(operator: Operator<TEntity>): void;
    remove(operator: Operator<TEntity>): boolean;
    first<T extends Operator<TEntity>>(operator: {
        new (...args: any[]): T;
    }): T;
    first(operator: {
        new (...args: any[]): Operator<TEntity>;
    }): Operator<TEntity>;
    first(operatorType: OperatorType): Operator<TEntity>;
    values(): IterableIterator<Operator<TEntity>>;
}
export default class Enumerable<TEntity> implements IEnumerable<TEntity> {
    private items;
    private _operations;
    private _renames;
    constructor(items?: Array<TEntity>);
    rename(...values: Array<{
        from: string;
        to: string;
    }>): this;
    /**
     * Where clause using OData $filter expression returning either true or false. Any parameters used is properties of TEntity
     * @param predicate OData expression
     */
    where(predicate: string): this;
    /**
     * Where clause using Javascript expression returning either true or false
     * @param predicate javascript expression
     * @param parameters any javascript parameters has to be declared
     */
    where(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): this;
    take(count: number): this;
    skip(count: number): this;
    orderBy(property: (it: TEntity) => void): this;
    first(items?: Array<TEntity>): TEntity;
    toArray(items?: Array<TEntity>): Array<TEntity>;
    readonly operations: Operation<TEntity>;
    static fromArray<TEntity>(items?: Array<TEntity>): Enumerable<TEntity>;
    [Symbol.iterator]: () => Iterator<TEntity>;
}
