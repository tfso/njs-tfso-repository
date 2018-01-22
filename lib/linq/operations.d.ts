import { Operator, OperatorType } from './operators/operator';
export declare class Operations<TEntity> {
    private _stack;
    private _removed;
    constructor();
    add(operator: Operator<TEntity>): void;
    remove(operator: Operator<TEntity>): boolean;
    first(): Operator<TEntity>;
    first<T extends Operator<TEntity>>(operator: {
        new (...args: any[]): T;
    }): T;
    first(operator: {
        new (...args: any[]): Operator<TEntity>;
    }): Operator<TEntity>;
    first(operatorType: OperatorType): Operator<TEntity>;
    values(): IterableIterator<Operator<TEntity>>;
}
