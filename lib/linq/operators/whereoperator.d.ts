import { Operator } from './operator';
import { IExpression } from './../expressions/expression';
export declare type PredicateType = 'Javascript' | 'OData';
export declare class WhereOperator<TEntity> extends Operator<TEntity> {
    private _predicate;
    private _expression;
    private _footprint;
    constructor(predicateType: 'OData', predicate: string);
    constructor(predicateType: 'Javascript', predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: Array<any>);
    readonly predicate: (entity: TEntity) => boolean;
    expression: IExpression;
    evaluate(items: TEntity[]): TEntity[];
    toString(): string;
}
