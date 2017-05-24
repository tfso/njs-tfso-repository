import { Operator, OperatorType } from './operators/operator';
import { OrderByOperator } from './operators/orderbyoperator';
import { SkipOperator } from './operators/skipoperator';
import { TakeOperator } from './operators/takeoperator';
import { WhereOperator } from './operators/whereoperator';
import { SelectOperator } from './operators/selectoperator';
import { JoinOperator } from './operators/joinoperator';

import { RenameVisitor } from './expressions/renamevisitor';
import { RemapVisitor } from './expressions/remapvisitor';

import { Operations } from './operations';

export { OperatorType };

(Symbol as any).asyncIterator = Symbol.asyncIterator || "__@@asyncIterator__";

export interface IEnumerable<TEntity> extends Iterable<TEntity>, AsyncIterable<TEntity> {
    readonly operations: Operations<TEntity>
    readonly parent: IEnumerable<any>
    child: IEnumerable<any>

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

    //orderBy(property: (it: TEntity) => void): this
    //range(start: number, count: number): this
    skip(count: number): this
    take(count: number): this
    //reverse(): this

    join<TInner, TResult>(inner: IEnumerable<TInner>, outerKey: (a: TEntity) => void, innerKey: (b: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult): IEnumerable<TResult>
    select<TResult>(selector: (it: TEntity) => TResult): IEnumerable<TResult>

    first(items?: Array<TEntity>): TEntity
    toArray(items: Array<TEntity>): Array<TEntity>
    toArray(): Array<TEntity>
}

export class Enumerable<TEntity> implements IEnumerable<TEntity>
{
    protected _operations: Operations<TEntity>;
    protected _parent;
    protected _child;
   
    constructor(private items?: Iterable<TEntity> | AsyncIterable<TEntity>, parent?: IEnumerable<any>) {
        this._operations = new Operations<TEntity>();
        this._parent = parent;
    }

    public get parent(): IEnumerable<any> {
        return this._parent;
    }

    public get child(): IEnumerable<any> {
        return this._child;
    }

    public get operations(): Operations<TEntity> {
        return this._operations;
    }

    /**
     * A remapper of identifier names, members is seperated with dot.
     * @param remapper Function that returns the new name of the identifier
     */
    public remap(remapper: (name: string) => string)
    /**
     * A remapper of values that corresponds to a identifier name
     * @param remapper Function that returns the new value
     */
    public remap(remapper: (name: string, value: any) => any) 
    public remap(remapper: () => any) {
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
        return this._child = new Enumerable<TResult>(new SelectOperator<TEntity>(selector).evaluate(this), this);
    }

    /**
     * returns a new IEnumerable of TResult (Inner Join)
     * @param enumerable
     * @param predicate
     */
    public join<TInner, TResult>(inner: IEnumerable<TInner>, outerKey: (a: TEntity) => void, innerKey: (b: TInner) => void, selector: (outer: TEntity, inner: IEnumerable<TInner>) => TResult): IEnumerable<TResult> {
        return this._child = new Enumerable<TResult>(new JoinOperator<TEntity, TInner, TResult>(outerKey, innerKey, selector).evaluate(this, inner), this);
    }

    public take(count: number): this {
        this._operations.add(new TakeOperator<TEntity>(count));

        return this;
    }

    public skip(count: number): this {
        this._operations.add(new SkipOperator<TEntity>(count));

        return this;
    }

    public orderBy(property: (it: TEntity) => void): this {
        this._operations.add(new OrderByOperator<TEntity>(property));

        return this;
    }

    public first(items?: Array<TEntity>): TEntity {
        let iteratorResult = this.iterator().next();

        if (iteratorResult.done == false)
            return iteratorResult.value;

        return null;
    }

    public toArray(items?: Iterable<TEntity>): Array<TEntity> {
        if (items)
            this.items = items;

        return Array.from(this.iterator());
    }

    public static fromArray<TEntity>(items?: Array<TEntity>): Enumerable<TEntity> {
        return new Enumerable(items);
    }

    protected * iterator(): IterableIterator<TEntity> {
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

        yield* handleItems(<Iterable<TEntity>>this.items, Array.from(this.operations.values()));
    }

    protected async * asyncIterator(): AsyncIterableIterator<TEntity> {
        let handleItems = async function* (items: AsyncIterable<TEntity>, operators: Array<Operator<TEntity>>, idx: number = null) { 
            if(idx == null) idx = operators.length - 1;
            
            switch(idx) {
                case -1:
                    for await (let item of items)
                        yield item;
                    
                    break;

                case 0:
                    yield* operators[idx].evaluateAsync( items ); break;
                
                default:
                    yield* operators[idx].evaluateAsync( handleItems(items, operators, idx - 1) ); break;
            }
        }

        yield* handleItems(<AsyncIterable<TEntity>>this.items, Array.from(this.operations.values()));        
    }

    [Symbol.asyncIterator] = () => {
        return this.asyncIterator();
    }

    [Symbol.iterator] = () => {
        return this.iterator();
    }
}

export class EnumerableParent<TEntity, TParent> extends Enumerable<TEntity> implements IEnumerable<TEntity>
{
    constructor(items?: Iterable<TEntity>, parent?: Enumerable<TParent>) {
        super(items);

        this._parent = parent;
    }

    public get parent(): IEnumerable<TParent> {
        return this._parent;
    }
}

export default Enumerable;