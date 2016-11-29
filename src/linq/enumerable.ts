export interface IEnumerable<TEntity> extends Iterable<TEntity> {
    where(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): this
    //orderBy(property: (it: TEntity) => void): this
    //range(start: number, count: number): this
    skip(count: number): this
    take(count: number): this
    //reverse(): this

    toArray(items: Array<TEntity>): Array<TEntity>
    toArray(): Array<TEntity>

    readonly operations: Operation<TEntity>
}

import { Operator, OperatorType } from './operators/operator';
import { OrderByOperator } from './operators/orderbyoperator';
import { SkipOperator } from './operators/skipoperator';
import { TakeOperator } from './operators/takeoperator';
import { WhereOperator } from './operators/whereoperator';

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

    public first<T>(operator: { new (...args: any[]): Operator<TEntity> }): Operator<TEntity> 
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
    constructor(private items?: Array<TEntity>) {
        this._operations = new Operation<TEntity>();
    }

    public where(predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]): this {
        this._operations.add(new WhereOperator<TEntity>(predicate, ...parameters));

        return this;
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

    public toArray(items?: Array<TEntity>): Array<TEntity> {
        let ar = items || this.items;

        for (let item of this._operations.values())
            ar = item.evaluate(ar);

        return ar;
    }

    //public validateSequence(...operators: OperatorType[]): boolean {
    //    let idx = -1;
       
    //    return operators.every(operator => {
    //        let newIdx = 0;

    //        newIdx = this._stack.findIndex(item => (item.type & operator) > 0)

    //        if (newIdx == -1) {
    //            return true;
    //        } else if (newIdx > idx) {
    //            idx = newIdx; return true;
    //        } else {
    //            return false;
    //        }
    //    });
    //}

    //public getFirstOperator(type: OperatorType): Operator<TEntity> {
    //    for (let i = 0; i < this._stack.length; i++)
    //        if (this._stack[i].type == type)
    //            return this._stack[i];
    //}

    //public removeFirstOperator(type: OperatorType): Operator<TEntity> {
    //    for (let i = 0; i < this._stack.length; i++)
    //        if (this._stack[i].type == type)
    //            return this._stack.splice(i, 1)[0];
    //}

    public get operations(): Operation<TEntity> {
        return this._operations;
    }

    public static fromArray<TEntity>(items?: Array<TEntity>): Enumerable<TEntity> {
        return new Enumerable(items);
    }

    [Symbol.iterator] = function* (): Iterator<TEntity> {
        let counter = 0;
        let result: Array<TEntity> = this.toArray();

        while (true) {
            for (let item of result) {
                var reset = yield item;

                if (reset === true)
                    break;
            }

            if (reset !== true) // continue while loop if it's resetted
                break;
        }
    }
}
