import { Operator, OperatorType } from './operator';

import { IExpression, ExpressionType } from './../expressions/expression';
import { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './../expressions/logicalexpression';
import { MemberExpression } from './../expressions/memberexpression';
import { IdentifierExpression } from './../expressions/identifierexpression';

import { ReducerVisitor } from './../expressions/reducervisitor';
import { ODataVisitor } from './../expressions/odatavisitor';

export type PredicateType = 'Javascript' | 'OData';

export class WhereOperator<TEntity> extends Operator<TEntity> {
    private _predicate: (entity: TEntity) => boolean;
    private _expression: IExpression;

    private _it: string;

    private _footprint: string

    constructor(predicateType: 'OData', predicate: string)
    constructor(predicateType: 'Javascript', predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: Array<any>)
    constructor(predicateType: PredicateType, predicate: any, ...parameters: any[]) {
        super(OperatorType.Where);

        //this._parameters = parameters;

        switch (predicateType) {
            case 'Javascript':
                let visitor: ReducerVisitor;

                this._expression = (visitor = new ReducerVisitor()).visitLambda(predicate, ...parameters);
                this._it = visitor.it;

                this._footprint = new Object(predicate).toString();
                this._predicate = (entity: TEntity) => {
                    return predicate.apply({}, [entity].concat(parameters)) === true;
                };

                if (visitor.isSolvable == false)
                    throw new Error('Predicate is not solvable');

                break;

            case 'OData':
                this._expression = new ODataVisitor().visitOData(predicate);
                this._it = "";

                this._footprint = predicate;
                this._predicate = (entity: TEntity) => {
                    return ODataVisitor.evaluate(this._expression, entity) === true;
                }
                
                break;
        }
    }

    //public get parameters(): any[] {
    //    return this._parameters;
    //}

    public get predicate(): (entity: TEntity) => boolean {
        return this._predicate == null ? () => true : this._predicate;
    }

    public get expression(): IExpression {
        return this._expression;
    }

    public set expression(value: IExpression) {
        this._expression = value;
    }

    public* evaluate(items: Iterable<TEntity>): IterableIterator<TEntity> {
        for (let item of items)
            if (this._predicate(item)) yield item;
    }
    
    public async * evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<TEntity> {    
        for await (let item of items)
            if (this._predicate(item)) yield item;
    }

    public getExpressionIntersection(): ILogicalExpression[] {
        let intersection: Array<ILogicalExpression>;

        intersection = Array.from(this.getExpressionGroups()).reduce((acc, curr, idx) => {
            return Array.from(curr).filter((expr) => {
                return !acc || acc.some(intersect => expr.equal(intersect));
            });
        }, intersection);

        return intersection || [];
    }

    public getExpressionUnion(): ILogicalExpression[] {
        let union: Array<ILogicalExpression>;

        union = Array.from(this.getExpressionGroups()).reduce((acc, curr, idx) => {
            return (acc || []).concat(Array.from(curr));
        }, union);

        return union || [];
    }

    public getExpressionCount(): number {
        let visit = (expression: IExpression) : number => {

            switch (expression.type)
            {
                case ExpressionType.Logical:
                    switch ((<LogicalExpression>expression).operator)
                    {
                        case LogicalOperatorType.And:
                        case LogicalOperatorType.Or:
                            return visit((<LogicalExpression>expression).left) + visit((<LogicalExpression>expression).right);

                        default:
                            return 1;
                    }

                default:
                    return 0;
            }
        }

        return visit(this.expression);
    }

    private getExpressionGroups(): Iterable<IterableIterator<ILogicalExpression>> {
        let it = this._it,
            visit = function* (expression: IExpression): Iterable<IterableIterator<ILogicalExpression>> {
                let visitGroup = function* (child: LogicalExpression): IterableIterator<ILogicalExpression> {
                    switch (child.operator) {
                        case LogicalOperatorType.Or:
                            break;

                        case LogicalOperatorType.And:
                            if (child.left instanceof LogicalExpression) yield* visitGroup(child.left);
                            if (child.right instanceof LogicalExpression) yield* visitGroup(child.right);
                            break;

                        default:                      
                            let reduceMemberToIdentifier = (expr: IExpression): IExpression => {
                                switch (expr.type) {
                                    case ExpressionType.Logical:
                                        let left = reduceMemberToIdentifier((<LogicalExpression>expr).left),
                                            right = reduceMemberToIdentifier((<LogicalExpression>expr).right);

                                        if ((left.type == ExpressionType.Identifier || left.type == ExpressionType.Member || left.type == ExpressionType.Method) == false) {
                                            switch ((<LogicalExpression>expr).operator) {
                                                case LogicalOperatorType.And:
                                                case LogicalOperatorType.Or:
                                                case LogicalOperatorType.NotEqual:
                                                case LogicalOperatorType.Equal:
                                                    return new LogicalExpression((<LogicalExpression>expr).operator, left, right);

                                                case LogicalOperatorType.Greater: // 5 > 2 == 2 < 5
                                                    return new LogicalExpression(LogicalOperatorType.Lesser, right, left);

                                                case LogicalOperatorType.GreaterOrEqual: // 5 >= 2 == 2 <= 5
                                                    return new LogicalExpression(LogicalOperatorType.LesserOrEqual, right, left);

                                                case LogicalOperatorType.Lesser: // 5 < 2 == 2 > 5
                                                    return new LogicalExpression(LogicalOperatorType.Greater, right, left);

                                                case LogicalOperatorType.LesserOrEqual: // 5 <= 2 == 2 >= 5
                                                    return new LogicalExpression(LogicalOperatorType.GreaterOrEqual, right, left);
                                            }
                                        }

                                        return new LogicalExpression((<LogicalExpression>expr).operator, left, right);

                                    case ExpressionType.Member:
                                        if ((<MemberExpression>expr).object.type == ExpressionType.Identifier && (<IdentifierExpression>(<MemberExpression>expr).object).name == it)
                                            return (<MemberExpression>expr).property;
                                        else
                                            return expr;
                                        
                                    default:
                                        return expr;
                                }
                            }

                            let reduced = reduceMemberToIdentifier(child);
                            if(reduced.type == ExpressionType.Logical)
                                yield <ILogicalExpression>reduced;
                    }
                }

                if (expression instanceof LogicalExpression) {
                    if (expression.operator == LogicalOperatorType.Or) {
                        yield* visit(expression.left);
                        yield* visit(expression.right);
                    }
                    else {
                        yield visitGroup(expression);
                    }
                }
            };

        // TODO; make a simplifier visitor that returns member expressions at left side an evaluates method call expressions (reduceMemberToIdentifier above does this now);
        return visit(this.expression);
    }

    public toString(): string {
        return this._footprint; // should be this._expression.toString() sooner or later
    }

    
}