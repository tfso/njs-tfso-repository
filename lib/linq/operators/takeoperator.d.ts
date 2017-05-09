import { Operator } from './operator';
export declare class TakeOperator<TEntity> extends Operator<TEntity> {
    count: number;
    constructor(count: number);
    evaluate(items: TEntity[]): TEntity[];
}
