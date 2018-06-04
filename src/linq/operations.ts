import { Operator, OperatorType } from './operators/operator';
import { SkipOperator } from './operators/skipoperator';
import { TakeOperator } from './operators/takeoperator';
import { WhereOperator } from './operators/whereoperator';
import { SkipWhileOperator } from './operators/skipwhileoperator';
import { SliceOperator } from './operators/sliceoperator';
import { SelectOperator } from './operators/selectoperator';
import { JoinOperator } from './operators/joinoperator';
import { OrderByOperator } from './operators/orderbyoperator';

export class Operations<TEntity> {
    private _stack: Array<Operator<TEntity>>;
    private _removed: Array<Operator<TEntity>>;

    constructor() {
        this._stack = [];
        this._removed = [];
    }

    public add(operator: Operator<TEntity>): void {
        this._stack.push(operator);
    }

    public remove(operator: Operator<TEntity>): boolean {
        var idx = this._stack.indexOf(operator);

        if (idx != -1) {
            this._removed.push(operator);
            operator.remove();

            return true;
        }

        return false;
    }
    
    // https://stackoverflow.com/questions/48207567/derive-generic-type-of-a-class-from-a-specific-factory-method-parameter-value
    public first(): Operator<TEntity>
    public first<T extends Operator<TEntity>>(operator: { new (...args: any[]): T }): T
    public first<T extends SkipOperator<TEntity>>(operator: { new (...args: any[]): T }): T
    public first<T extends SkipWhileOperator<TEntity>>(operator: { new (...args: any[]): T }): T
    public first<T extends TakeOperator<TEntity>>(operator: { new (...args: any[]): T }): T
    public first<T extends WhereOperator<TEntity>>(operator: { new (...args: any[]): T }): T
    public first<T extends SliceOperator<TEntity>>(operator: { new (...args: any[]): T }): T
    public first<T extends SelectOperator<TEntity>>(operator: { new (...args: any[]): T }): T
    public first<T extends OrderByOperator<TEntity>>(operator: { new (...args: any[]): T }): T

    public first<U extends OperatorType.Skip>(operatorType: U): SkipOperator<TEntity>
    public first<U extends OperatorType.SkipWhile>(operatorType: U): SkipWhileOperator<TEntity>
    public first<U extends OperatorType.Take>(operatorType: U): TakeOperator<TEntity>
    public first<U extends OperatorType.Where>(operatorType: U): WhereOperator<TEntity>
    public first<U extends OperatorType.Slice>(operatorType: U): SliceOperator<TEntity>
    public first<U extends OperatorType.Select>(operatorType: U): SelectOperator<TEntity>
    public first<U extends OperatorType.OrderBy>(operatorType: U): OrderByOperator<TEntity>

    public first<U extends OperatorType.Join, TInner, TResult>(operatorType: U): JoinOperator<TEntity, TInner, TResult>
    public first<U extends OperatorType>(operatorType: U): Operator<TEntity> 
    public first(o?: any): Operator<TEntity> {
        if(o == null)
            return this.values().next().value;

        for (let item of this.values())
            if (item.type === o || (typeof o == 'function' && item instanceof o))
                return item;

        return null;
    }

    public* values(): IterableIterator<Operator<TEntity>> {
        while (true) {
            let reset;

            for (let item of this._stack) {
                if (this._removed.indexOf(item) >= 0)
                    continue;

                reset = yield item;
                if (reset === true)
                    break;
            }

            if (reset !== true) // continue while loop if it's resetted
                break;
        }
    }
}