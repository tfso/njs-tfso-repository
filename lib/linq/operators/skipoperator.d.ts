import { Operator } from './operator';
export declare class SkipOperator<TEntity> extends Operator<TEntity> {
    count: number;
    constructor(count: number);
    evaluate(items: TEntity[]): TEntity[];
}
