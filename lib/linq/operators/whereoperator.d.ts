import { Operator } from './operator';
import { IExpression } from './../expressions/expression';
import { ILogicalExpression } from './../expressions/logicalexpression';
export declare type PredicateType = 'Javascript' | 'OData';
export declare class WhereOperator<TEntity> extends Operator<TEntity> {
    private predicateType;
    private _predicate;
    private _expression;
    private _it;
    private _footprint;
    constructor(predicateType: 'OData', predicate: string);
    constructor(predicateType: 'Javascript', predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: Array<any>);
    readonly predicate: (entity: TEntity) => boolean;
    expression: IExpression;
    evaluate(items: Iterable<TEntity>): IterableIterator<TEntity>;
    evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<TEntity>;
    getExpressionIntersection(): ILogicalExpression[];
    getExpressionUnion(): ILogicalExpression[];
    getExpressionCount(): number;
    getExpressionGroups(): Iterable<IterableIterator<ILogicalExpression>>;
    toString(): string;
}
