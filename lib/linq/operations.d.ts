import { Operator, OperatorType } from './operators/operator';
import { SkipOperator } from './operators/skipoperator';
import { TakeOperator } from './operators/takeoperator';
import { WhereOperator } from './operators/whereoperator';
import { SkipWhileOperator } from './operators/skipwhileoperator';
import { SliceOperator } from './operators/sliceoperator';
import { SelectOperator } from './operators/selectoperator';
import { JoinOperator } from './operators/joinoperator';
import { OrderByOperator } from './operators/orderbyoperator';
export declare class Operations<TEntity> {
    private _stack;
    private _removed;
    constructor();
    add(operator: Operator<TEntity>): void;
    remove(operator: Operator<TEntity>): boolean;
    first(): Operator<TEntity>;
    first<T extends SkipOperator<TEntity>>(operator: {
        new (...args: any[]): T;
    }): T;
    first<T extends SkipWhileOperator<TEntity>>(operator: {
        new (...args: any[]): T;
    }): T;
    first<T extends TakeOperator<TEntity>>(operator: {
        new (...args: any[]): T;
    }): T;
    first<T extends WhereOperator<TEntity>>(operator: {
        new (...args: any[]): T;
    }): T;
    first<T extends SliceOperator<TEntity>>(operator: {
        new (...args: any[]): T;
    }): T;
    first<T extends SelectOperator<TEntity>>(operator: {
        new (...args: any[]): T;
    }): T;
    first<T extends OrderByOperator<TEntity>>(operator: {
        new (...args: any[]): T;
    }): T;
    first<T extends Operator<TEntity>>(operator: {
        new (...args: any[]): T;
    }): T;
    first<U extends OperatorType.Skip>(operatorType: U): SkipOperator<TEntity>;
    first<U extends OperatorType.SkipWhile>(operatorType: U): SkipWhileOperator<TEntity>;
    first<U extends OperatorType.Take>(operatorType: U): TakeOperator<TEntity>;
    first<U extends OperatorType.Where>(operatorType: U): WhereOperator<TEntity>;
    first<U extends OperatorType.Slice>(operatorType: U): SliceOperator<TEntity>;
    first<U extends OperatorType.Select>(operatorType: U): SelectOperator<TEntity>;
    first<U extends OperatorType.OrderBy>(operatorType: U): OrderByOperator<TEntity>;
    first<U extends OperatorType.Join, TInner, TResult>(operatorType: U): JoinOperator<TEntity, TInner, TResult>;
    first<U extends OperatorType>(operatorType: U): Operator<TEntity>;
    values(): IterableIterator<Operator<TEntity>>;
}
