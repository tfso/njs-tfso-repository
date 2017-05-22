export interface IEnumerable<TEntity> extends Iterable<TEntity> {

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

    first(items?: Array<TEntity>): TEntity
    toArray(items: Array<TEntity>): Array<TEntity>
    toArray(): Array<TEntity>

    readonly operations: Operation<TEntity>
}

import { Operator, OperatorType } from './operators/operator';
import { OrderByOperator } from './operators/orderbyoperator';
import { SkipOperator } from './operators/skipoperator';
import { TakeOperator } from './operators/takeoperator';
import { WhereOperator } from './operators/whereoperator';
import { SelectOperator } from './operators/selectoperator';
import { JoinOperator } from './operators/joinoperator';

import { RenameVisitor } from './expressions/renamevisitor';
import { RemapVisitor } from './expressions/remapvisitor';

export { OperatorType };

export class Operation<TEntity> {
    private _stack: Array<Operator<TEntity>>;

    constructor() {
        this._stack = [];
    }

    public add(operator: Operator<TEntity>): void {
        this._stack.push(operator);
    }

    public remove(operator: Operator<TEntity>): boolean {
        var idx = this._stack.indexOf(operator);

        if (idx != -1) {
            this._stack.splice(idx, 1);

            return true;
        }

        return false;
    }
    
    public first<T extends Operator<TEntity>>(operator: { new (...args: any[]): T }): T
    public first(operator: { new (...args: any[]): Operator<TEntity> }): Operator<TEntity>
    public first(operatorType: OperatorType): Operator<TEntity> 
    public first(o: any): Operator<TEntity> {
        for (let item of this.values())
            if (item.type === o || (typeof o == 'function' && item instanceof o))
                return item;

        return null;
    }

    public* values(): IterableIterator<Operator<TEntity>> {
        while (true) {
            for (let item of this._stack) {
                var reset = yield item;

                if (reset === true)
                    break;
            }

            if (reset !== true) // continue while loop if it's resetted
                break;
        }
    }
}

export default class Enumerable<TEntity> implements IEnumerable<TEntity>
{
    private _operations: Operation<TEntity>;
    protected _child;

    constructor(private items?: Iterable<TEntity>, public readonly parent?: IEnumerable<any>) {
        this._operations = new Operation<TEntity>();
    }

    protected get child(): IEnumerable<any> {
        return this._child;
    }

    public get operations(): Operation<TEntity> {
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
    public join<TInner, TResult>(inner: IEnumerable<TInner>, outerKey: (a: TEntity) => void, innerKey: (b: TInner) => void, selector: (outer: TEntity, inner: Iterator<TInner>) => TResult): IEnumerable<TResult> {
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


    //public toString(type: any): string {
    //    let out: string = '';

    //    switch (type) {
    //        case 'OData':
    //            for (let item of this._operations.values()) {
    //                switch (item.type) {
    //                    case OperatorType.Skip:
    //                        out += "$skip=" + (<SkipOperator<TEntity>>item).count;
    //                        break;

    //                    case OperatorType.Take:
    //                        out += "$top=" + (<TakeOperator<TEntity>>item).count;
    //                        break;

    //                    case OperatorType.Where:
    //                        out += "$filter=";



    //                        break;
    //                }
    //            }

    //        default:
    //            for (let item of this._operations.values())
    //                out += (out.length == 0 ? '' : '.') + OperatorType[item.type] + '(' + item.toString() + ')'

    //            break;
    //    }

    //    return out;
    //}

    private* iterator(): IterableIterator<TEntity> {
        let result = this.items;

        // optimize this, no point do all where predicates when we want to take first 10 
        for (let item of this._operations.values())
            result = item.evaluate(result);

        for (let item of result) {
            let reset = yield item;

            if (reset === true)
                break;
        }
    }

    [Symbol.iterator] = () => {
        return this.iterator();
    }
}
