import { Operator } from './operator';
export declare class OrderByOperator<TEntity> extends Operator<TEntity> {
    property: (it: TEntity) => void;
    private _expression;
    constructor(property: (it: TEntity) => void);
    evaluate(items: TEntity[]): TEntity[];
}
