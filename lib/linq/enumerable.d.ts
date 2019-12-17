import { OperatorType } from './operators/operator';
import { Operations } from './operations';
export { OperatorType };
export interface IEnumerableOptions<TEntity> {
    query?: IEnumerable<TEntity>;
    parent?: IEnumerable<any>;
}
export interface IEnumerable<TEntity> extends Iterable<TEntity>, AsyncIterable<TEntity> {
    readonly operations: Operations<TEntity>;
    from(items: Array<TEntity>): this;
    from(items: Iterable<TEntity>): this;
    from(items: AsyncIterable<TEntity>): this;
    /**
     * A remapper of identifier names, members is seperated with dot.
     * @param remapper Function that returns the new name of the identifier
     */
    remap<TResult>(remapper: (name: string) => string): IEnumerable<TResult>;
    /**
     * A remapper of values that corresponds to a identifier name
     * @param remapper Function that returns the new value
     */
    remap<TResult>(remapper: (name: string, value: any) => any): IEnumerable<TResult>;
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
    orderBy(property: (it: TEntity) => void): this;
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements
     * @param count The number of elements to skip before returning the remaining elements
     */
    skip(count: number): this;
    /**
     * Bypassing elements using OData $filter expression as long as specified condition is true and then returns the remaining elements
     * @param predicate OData expression
     */
    skipWhile(predicate: string): this;
    /**
     * Bypassing elements using Javascript expression as long as specified condition is true and then returns the remaining elements
     * @param predicate javascript expression
     * @param parameters any javascript parameters has to be declared
     */
    skipWhile(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): this;
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return
     */
    take(count: number): this;
    /**
     * Bypasses all elements before beginning and returns the remaining elements or up to the specified end
     * @param begin zero-based index at which to begin extraction
     * @param end zero-based index before which to end extraction
     */
    slice(begin: number, end?: number): this;
    /**
     * Bypasses all elements before beginning and returns the remaining elements
     * Note: If the beginning is not an index it's up to the repository to handle slicing.
     * @param token a token that indicates where to begin extraction
     */
    slice(token: any): this;
    /**
     * returns a new IEnumerable of TResult (Left Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    groupJoin<TInner, TResult>(inner: Iterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult>;
    /**
     * returns a new IEnumerable of TResult (Left Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    groupJoin<TInner, TResult>(inner: AsyncIterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult>;
    /**
     * returns a new IEnumerable of TResult (Inner Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    join<TInner, TResult>(inner: Iterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult>;
    /**
     * returns a new IEnumerable of TResult (Inner Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    join<TInner, TResult>(inner: AsyncIterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult>;
    /**
    * returns a new IEnumerable of TResult
    * @param selector
    */
    select<TResult>(selector: (it: TEntity) => TResult): IEnumerable<TResult>;
    first(items?: Array<TEntity>): TEntity;
    firstAsync(items?: Array<TEntity>): Promise<TEntity>;
    toArray(items: Array<TEntity>): Array<TEntity>;
    toArray(): Array<TEntity>;
    toArrayAsync(items: Array<TEntity>): Promise<Array<TEntity>>;
    toArrayAsync(): Promise<Array<TEntity>>;
    copy(): IEnumerable<TEntity>;
}
export declare class Enumerable<TEntity> implements IEnumerable<TEntity> {
    private items?;
    private _name;
    protected _operations: Operations<TEntity>;
    constructor(items?: Array<TEntity>);
    constructor(items?: Iterable<TEntity>);
    constructor(items?: AsyncIterable<TEntity>);
    readonly name: string;
    readonly operations: Operations<TEntity>;
    /**
     * A remapper of identifier names, members is seperated with dot.
     * @param remapper Function that returns the new name of the identifier
     */
    remap<TResult>(remapper: (name: string) => string): IEnumerable<TResult>;
    /**
     * A remapper of values that corresponds to a identifier name
     * @param remapper Function that returns the new value
     */
    remap<TResult>(remapper: (name: string, value: any) => any): IEnumerable<TResult>;
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
    /**
    * returns a new IEnumerable of TResult
    * @param selector
    */
    select<TResult>(selector: (it: TEntity) => TResult): IEnumerable<TResult>;
    /**
     * returns a new IEnumerable of TResult (Left Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    groupJoin<TInner, TResult>(inner: Iterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult>;
    /**
     * returns a new IEnumerable of TResult (Left Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    groupJoin<TInner, TResult>(inner: AsyncIterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult>;
    /**
     * returns a new IEnumerable of TResult (Inner Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    join<TInner, TResult>(inner: Iterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult>;
    /**
     * returns a new IEnumerable of TResult (Inner Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    join<TInner, TResult>(inner: AsyncIterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult>;
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return
     */
    take(count: number): this;
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements
     * @param count The number of elements to skip before returning the remaining elements
     */
    skip(count: number): this;
    /**
     * Bypassing elements using OData $filter expression as long as specified condition is true and then returns the remaining elements
     * @param predicate OData expression
     */
    skipWhile(predicate: string): this;
    /**
     * Bypassing elements using Javascript expression as long as specified condition is true and then returns the remaining elements
     * @param predicate javascript expression
     * @param parameters any javascript parameters has to be declared
     */
    skipWhile(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): this;
    orderBy(property: (it: TEntity) => void): this;
    /**
     * Bypasses all elements before beginning and returns the remaining elements or up to the specified end
     * @param begin zero-based index at which to begin extraction
     * @param end zero-based index before which to end extraction
     */
    slice(begin: number, end?: number): this;
    /**
     * Bypasses all elements before beginning and returns the remaining elements
     * Note: If the beginning is not an index it's up to the repository to handle slicing.
     * @param token a token that indicates where to begin extraction
     */
    slice(token: any): this;
    from(items: Array<TEntity>): this;
    from(items: Iterable<TEntity>): this;
    from(items: AsyncIterable<TEntity>): this;
    copy(): IEnumerable<TEntity>;
    first(items?: Array<TEntity>): TEntity;
    firstAsync(items?: Array<TEntity>): Promise<TEntity>;
    toArray(items?: Iterable<TEntity>): Array<TEntity>;
    toArrayAsync(items?: Iterable<TEntity>): Promise<Array<TEntity>>;
    static fromArray<TEntity>(items?: Array<TEntity>): Enumerable<TEntity>;
    protected iterator(options?: IEnumerableOptions<TEntity>): IterableIterator<TEntity>;
    protected asyncIterator(options?: IEnumerableOptions<TEntity>): AsyncIterableIterator<TEntity>;
    [Symbol.asyncIterator]: () => AsyncIterableIterator<TEntity>;
    [Symbol.iterator]: () => IterableIterator<TEntity>;
}
export default Enumerable;
