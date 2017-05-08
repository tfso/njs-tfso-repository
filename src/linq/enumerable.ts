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

import { RenameVisitor } from './expressions/renamevisitor';

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
    private _renames: Map<string, string> = new Map();

    constructor(private items?: Array<TEntity>) {
        this._operations = new Operation<TEntity>();
    }

    public rename(...values: Array<{ from: string, to: string }>): this { 
        // remap existing Identifiers/Members
        let renameVisitor = new RenameVisitor(...values);

        for (let item of this._operations.values()) {
            switch (item.type) {
                case OperatorType.Where:
                    (<WhereOperator<TEntity>>item).expression = renameVisitor.visit((<WhereOperator<TEntity>>item).expression);
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

        if (arguments.length == 2 && Array.isArray(arguments[1]))
            parameters = arguments[1];

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
        let result = this.toArray(items);

        return result.length > 0 ? result[0] : null;
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
