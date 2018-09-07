import { Operator, OperatorType } from './operators/operator';
import { OrderByOperator } from './operators/orderbyoperator';
import { SkipOperator } from './operators/skipoperator';
import { SkipWhileOperator } from './operators/skipwhileoperator';
import { TakeOperator } from './operators/takeoperator';
import { WhereOperator } from './operators/whereoperator';
import { SelectOperator } from './operators/selectoperator';
import { JoinOperator, JoinType } from './operators/joinoperator';
import { SliceOperator } from './operators/sliceoperator';

import { RenameVisitor } from './expressions/renamevisitor';
import { RemapVisitor } from './expressions/remapvisitor';

import { Operations } from './operations';

export { OperatorType };

export interface IEnumerableOptions<TEntity> {
    query?: IEnumerable<TEntity>
    parent?: IEnumerable<any>
}

export interface IEnumerable<TEntity> extends Iterable<TEntity>, AsyncIterable<TEntity> {
    readonly operations: Operations<TEntity>

    from(items: Array<TEntity>)
    from(items: Iterable<TEntity>)
    from(items: AsyncIterable<TEntity>)

    /**
     * A remapper of identifier names, members is seperated with dot.
     * @param remapper Function that returns the new name of the identifier
     */
    remap(remapper: (name: string) => string) : this
    /**
     * A remapper of values that corresponds to a identifier name
     * @param remapper Function that returns the new value
     */
    remap(remapper: (name: string, value: any) => any) : this

    /**
    * Where clause using OData $filter expression returning either true or false. Any parameters used is properties of TEntity
    * @param predicate OData expression
    */
    where(predicate: string): this
    /**
     * Where clause using Javascript expression returning either true or false
     * @param predicate javascript expression
     * @param parameters any javascript parameters has to be declared
     */
    where(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): this

    orderBy(property: (it: TEntity) => void): this

    //range(start: number, count: number): this
    
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements
     * @param count The number of elements to skip before returning the remaining elements
     */
    skip(count: number): this

    /**
     * Bypassing elements using OData $filter expression as long as specified condition is true and then returns the remaining elements
     * @param predicate OData expression
     */
    skipWhile(predicate: string): this
    /**
     * Bypassing elements using Javascript expression as long as specified condition is true and then returns the remaining elements
     * @param predicate javascript expression
     * @param parameters any javascript parameters has to be declared
     */
    skipWhile(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): this

    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return
     */
    take(count: number): this
    //reverse(): this

    /**
     * Bypasses all elements before beginning and returns the remaining elements or up to the specified end
     * @param begin zero-based index at which to begin extraction
     * @param end zero-based index before which to end extraction
     */
    slice(begin: number, end?: number): this
    /**
     * Bypasses all elements before beginning and returns the remaining elements
     * Note: If the beginning is not an index it's up to the repository to handle slicing.
     * @param token a token that indicates where to begin extraction
     */
    slice(token: any): this    

    /**
     * returns a new IEnumerable of TResult (Left Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    groupJoin<TInner, TResult>(inner: Iterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult>
    /**
     * returns a new IEnumerable of TResult (Left Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    groupJoin<TInner, TResult>(inner: AsyncIterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult> 

    /**
     * returns a new IEnumerable of TResult (Inner Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    join<TInner, TResult>(inner: Iterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult> 
    /**
     * returns a new IEnumerable of TResult (Inner Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    join<TInner, TResult>(inner: AsyncIterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult>

    /**
    * returns a new IEnumerable of TResult
    * @param selector
    */
    select<TResult>(selector: (it: TEntity) => TResult): IEnumerable<TResult>

    first(items?: Array<TEntity>): TEntity
    firstAsync(items?: Array<TEntity>): Promise<TEntity>

    toArray(items: Array<TEntity>): Array<TEntity>
    toArray(): Array<TEntity>

    toArrayAsync(items: Array<TEntity>): Promise<Array<TEntity>>
    toArrayAsync(): Promise<Array<TEntity>>

    copy(): IEnumerable<TEntity>
}

export class Enumerable<TEntity> implements IEnumerable<TEntity>
{
    private _name: string = null;

    protected _operations: Operations<TEntity>;
    
    constructor(items?: Array<TEntity>) 
    constructor(items?: Iterable<TEntity>) 
    constructor(items?: AsyncIterable<TEntity>)
    constructor(private items?: any) {
        this._operations = new Operations<TEntity>();

        this.from(items);
    }

    public get name(): string {
        if (this._name != null)
            return this._name;

        if(this.items)
            return this.items.constructor.name;

        return "";
    }

    public get operations(): Operations<TEntity> {
        return this._operations;
    }

    /**
     * A remapper of identifier names, members is seperated with dot.
     * @param remapper Function that returns the new name of the identifier
     */
    public remap(remapper: (name: string) => string) : this
    /**
     * A remapper of values that corresponds to a identifier name
     * @param remapper Function that returns the new value
     */
    public remap(remapper: (name: string, value: any) => any) : this
    public remap(remapper: (...args) => any) : this {
        let visitor = remapper.length == 2 ? new RemapVisitor(null, remapper) : new RemapVisitor(remapper, null);
    
        for (let item of this._operations.values()) {
            switch (item.type) {
                case OperatorType.Where:
                    (<WhereOperator<TEntity>>item).expression = visitor.visit((<WhereOperator<TEntity>>item).expression);
                    break;
            }
        }

        return this;
    }

    /**
     * Where clause using OData $filter expression returning either true or false. Any parameters used is properties of TEntity
     * @param predicate OData expression
     */
    public where(predicate: string): this 
    /**
     * Where clause using Javascript expression returning either true or false
     * @param predicate javascript expression
     * @param parameters any javascript parameters has to be declared
     */
    public where(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): this
    public where(): this {
        let predicate: any = arguments[0],
            parameters: Array<any> = [];

        if (arguments.length >= 2)
            parameters = Array.from(arguments).slice(1)

        switch (typeof predicate) {
            case 'string':
                this._operations.add(new WhereOperator<TEntity>('OData', predicate));
                break;

            case 'function':
                this._operations.add(new WhereOperator<TEntity>('Javascript', predicate, ...parameters));
                break;

            default:
                throw new Error('Where operator can not recognize predicate either as javascript or odata');
        }

        return this;
    }
   
    /**
    * returns a new IEnumerable of TResult
    * @param selector
    */
    public select<TResult>(selector: (it: TEntity) => TResult): IEnumerable<TResult> {
        if (typeof this.items == 'object' && typeof this.items[Symbol.asyncIterator] == 'function') {
            return new Enumerable<TResult>(new SelectOperator<TEntity>(selector).evaluateAsync(this));
        } else {
            return new Enumerable<TResult>(new SelectOperator<TEntity>(selector).evaluate(this));
        }
    }

    /**
     * returns a new IEnumerable of TResult (Left Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    public groupJoin<TInner, TResult>(inner: Iterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult>
    /**
     * returns a new IEnumerable of TResult (Left Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    public groupJoin<TInner, TResult>(inner: AsyncIterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult> 
    public groupJoin<TInner, TResult>(inner: Iterable<TInner> | AsyncIterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing: boolean = false): IEnumerable<TResult> {
        let iterable: Iterable<TInner> | AsyncIterable<TInner> = ((scope) => <any>{
            [Symbol.asyncIterator]: (options) => {
                return inner[Symbol.asyncIterator](Object.assign({ parent: scope }, options));
            },
            [Symbol.iterator]: (options) => {
                return inner[Symbol.iterator](Object.assign({ parent: scope }, options));
            }
        })(this);

        if (typeof inner == 'object' && typeof inner[Symbol.asyncIterator] == 'function') {
            return new Enumerable<TResult>(new JoinOperator<TEntity, TInner, TResult>(JoinType.Left, outerKey, innerKey, selector, indexing).evaluateAsync(this, <AsyncIterable<TInner>>iterable));
        } else {
            return new Enumerable<TResult>(new JoinOperator<TEntity, TInner, TResult>(JoinType.Left, outerKey, innerKey, selector, indexing).evaluate(this, <Iterable<TInner>>iterable));
        }
    }

    /**
     * returns a new IEnumerable of TResult (Inner Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    public join<TInner, TResult>(inner: Iterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult> 
    /**
     * returns a new IEnumerable of TResult (Inner Join)
     * @param inner
     * @param outerKey
     * @param innerKey
     * @param selector A function that returns the new object, (outer, inner) => { outer, inner } or (outer, inner) => Object.assign({}, a, { childs: inner.toArray() })
     * @param indexing If set to true an Array of outerKey will be passed into iterator of TInner as { keys: Array<any> }. Cons, all elements of outer iterator will be be kept in memory.
     * @returns IEnumerable<TResult>
     */
    public join<TInner, TResult>(inner: AsyncIterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing?: boolean): IEnumerable<TResult>
    public join<TInner, TResult>(inner: Iterable<TInner> | AsyncIterable<TInner>, outerKey: (outer: TEntity) => void, innerKey: (inner: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult, indexing: boolean = false): IEnumerable<TResult> {
        let iterable: Iterable<TInner> | AsyncIterable<TInner> = ((scope) => <any>{
            [Symbol.asyncIterator]: (options) => {
                return inner[Symbol.asyncIterator](Object.assign({ parent: scope }, options));
            },
            [Symbol.iterator]: (options) => {
                return inner[Symbol.iterator](Object.assign({ parent: scope }, options));
            }
        })(this);

        if (typeof inner == 'object' && typeof inner[Symbol.asyncIterator] == 'function') {
            return new Enumerable<TResult>(new JoinOperator<TEntity, TInner, TResult>(JoinType.Inner, outerKey, innerKey, selector, indexing).evaluateAsync(this, <AsyncIterable<TInner>>iterable));
        } else {
            return new Enumerable<TResult>(new JoinOperator<TEntity, TInner, TResult>(JoinType.Inner, outerKey, innerKey, selector, indexing).evaluate(this, <Iterable<TInner>>iterable));
        }
    }

    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return
     */
    public take(count: number): this {
        this._operations.add(new TakeOperator<TEntity>(count));

        return this;
    }

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements
     * @param count The number of elements to skip before returning the remaining elements
     */
    public skip(count: number): this {
        this._operations.add(new SkipOperator<TEntity>(count));

        return this;
    }

    /**
     * Bypassing elements using OData $filter expression as long as specified condition is true and then returns the remaining elements
     * @param predicate OData expression
     */
    public skipWhile(predicate: string): this 
    /**
     * Bypassing elements using Javascript expression as long as specified condition is true and then returns the remaining elements
     * @param predicate javascript expression
     * @param parameters any javascript parameters has to be declared
     */
    public skipWhile(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): this
    public skipWhile(): this {
        let predicate: any = arguments[0],
            parameters: Array<any> = [];

        if (arguments.length >= 2)
            parameters = Array.from(arguments).slice(1)

        switch (typeof predicate) {
            case 'string':
                this._operations.add(new SkipWhileOperator<TEntity>('OData', predicate));
                break;

            case 'function':
                this._operations.add(new SkipWhileOperator<TEntity>('Javascript', predicate, ...parameters));
                break;

            default:
                throw new Error('SkipWhile operator can not recognize predicate either as javascript or odata');
        }

        return this;
    }

    public orderBy(property: (it: TEntity) => void): this {
        this._operations.add(new OrderByOperator<TEntity>(property));

        return this;
    }

    /**
     * Bypasses all elements before beginning and returns the remaining elements or up to the specified end
     * @param begin zero-based index at which to begin extraction
     * @param end zero-based index before which to end extraction
     */
    public slice(begin: number, end?: number): this
    /**
     * Bypasses all elements before beginning and returns the remaining elements
     * Note: If the beginning is not an index it's up to the repository to handle slicing.
     * @param token a token that indicates where to begin extraction
     */
    public slice(token: any): this
    public slice(begin: any, end: number = undefined): this
    {
        this._operations.add(new SliceOperator<TEntity>(begin, typeof begin == 'number' ? end : undefined));

        return this;
    }
    
    public from(items: Array<TEntity>) : this
    public from(items: Iterable<TEntity>) : this
    public from(items: AsyncIterable<TEntity>) : this
    public from(items: Array<TEntity> | Iterable<TEntity> | AsyncIterable<TEntity>): this {
        if (items) {
            if (this._name == null)
                this._name = items.constructor.name;

            this.items = items;

            if (typeof items == 'object' && typeof items[Symbol.asyncIterator] == 'function') {
                this[Symbol.iterator] = undefined; // this isn't an sync iterator, unmark it from IEnumerable
                this[Symbol.asyncIterator] = this.asyncIterator;
            }
            else if (typeof items == 'object' && typeof items[Symbol.iterator] == 'function') {
                this[Symbol.asyncIterator] = undefined; // this isn't an async iterator, unmark it from IEnumerable
                this[Symbol.iterator] = this.iterator;
            }
            else {
                throw new TypeError('Enumerable is instanced with a non-iterable object');
            }
        }

        return this;
    }

    public copy(): IEnumerable<TEntity> {
        let enumerable = new Enumerable<TEntity>(this.items)

        for(let operation of this.operations.values())
            enumerable.operations.add(operation)

        return enumerable
    }

    public first(items?: Array<TEntity>): TEntity {
        if (items)
            this.from(items);

        let iteratorResult = this[Symbol.iterator]().next();
        if (iteratorResult.done == false)
            return iteratorResult.value;

        return null;
    }

    public async firstAsync(items?: Array<TEntity>): Promise<TEntity> {
        if (items)
            this.from(items);

        let iteratorResult = await this[Symbol.asyncIterator]().next();
        if (iteratorResult.done == false)
            return iteratorResult.value;

        return null;
    }

    public toArray(items?: Iterable<TEntity>): Array<TEntity> {
        if (items)
            this.from(items);

        let result: Array<TEntity> = [];
        for (let item of this.iterator())
            result.push(item);

        return result;
    }

        
    public async toArrayAsync(items?: Iterable<TEntity>): Promise<Array<TEntity>> {
        if (items)
            this.from(items);

        let result: Array<TEntity> = [];
        for await(let item of this.asyncIterator()) //.asyncIterator())
            result.push(item);

        return result;
    }

    public static fromArray<TEntity>(items?: Array<TEntity>): Enumerable<TEntity> {
        return new Enumerable(items);
    }

    protected * iterator(options?: IEnumerableOptions<TEntity>): IterableIterator<TEntity> {
        if (!options || options.query == null)
            options = Object.assign(options || {}, { query: this });

        let handleItems = function* (items: Iterable<TEntity>, operators: Array<Operator<TEntity>>, idx: number = null) { 
            if(idx == null) idx = operators.length - 1;
            
            switch(idx) {
                case -1:
                    yield* items; break;

                case 0:
                    yield* operators[idx].evaluate( items ); break;
                
                default:
                    yield* operators[idx].evaluate( handleItems(items, operators, idx - 1) ); break;
            }
        }

        yield* handleItems(this.items[Symbol.iterator](options), Array.from(this.operations.values()));
    }

    protected async * asyncIterator(options?: IEnumerableOptions<TEntity>): AsyncIterableIterator<TEntity> {
        if (!options || options.query == null)
            options = Object.assign(options || {}, { query: this });

        let handleItems = async function* (items: AsyncIterable<TEntity>, operators: Array<Operator<TEntity>>, idx: number = null) { 
            if(idx == null) idx = operators.length - 1;
            
            switch(idx) {
                case -1:
                    for await (let item of items)
                        yield item;
                    
                    break;

                case 0:
                    yield* operators[idx].evaluateAsync(items); break;
                
                default:
                    yield* operators[idx].evaluateAsync(handleItems(items, operators, idx - 1)); break;
            }
        }

        yield* handleItems(this.items[Symbol.asyncIterator](options), Array.from(this.operations.values()));        
    }

    [Symbol.asyncIterator] = (): AsyncIterableIterator<TEntity> => this.asyncIterator();
    [Symbol.iterator] = (): IterableIterator<TEntity> => this.iterator();

}

export default Enumerable;