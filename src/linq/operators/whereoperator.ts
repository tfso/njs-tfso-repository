import { Operator, OperatorType } from './operator';

import { IExpression, ExpressionType } from './../expressions/expression';
import { LogicalExpression, LogicalOperatorType } from './../expressions/logicalexpression';

import { ReducerVisitor } from './../expressions/reducervisitor';
import { ODataVisitor } from './../expressions/odatavisitor';

export type PredicateType = 'Javascript' | 'OData';

export class WhereOperator<TEntity> extends Operator<TEntity> {
    private _predicate: (entity: TEntity) => boolean;
    private _expression: IExpression;

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
                this._footprint = new Object(predicate).toString();
                this._predicate = (entity: TEntity) => {
                    return predicate.apply({}, [entity].concat(parameters)) === true;
                };

                if (visitor.isSolvable == false)
                    throw new Error('Predicate is not solvable');

                break;

            case 'OData':
                this._expression = new ODataVisitor().visitOData(predicate);
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

    public evaluate(items: TEntity[]): TEntity[] {
        return items.filter(entity => this._predicate(entity));
    }

    public getExpressionIntersection(): IExpression[] {
        let intersection: Array<IExpression>;

        intersection = Array.from(this.getExpressionGroups()).reduce((acc, curr, idx) => {
            return Array.from(curr).filter((expr) => {
                return !acc || acc.some(intersect => expr.equal(intersect));
            });
        }, intersection);

        return intersection;
    }

    public getExpressionUnion(): IExpression[] {
        let union: Array<IExpression>;

        union = Array.from(this.getExpressionGroups()).reduce((acc, curr, idx) => {
            return (acc || []).concat(Array.from(curr));
        }, union);

        return union;
    }

    private getExpressionGroups(): Iterable<IterableIterator<IExpression>> {
        let visit = function* (expression: IExpression): Iterable<IterableIterator<IExpression>> {
            let visitGroup = function* (child: LogicalExpression): IterableIterator<IExpression> {
                switch (child.operator) {
                    case LogicalOperatorType.Or:
                        break;

                    case LogicalOperatorType.And:
                        if (child.left instanceof LogicalExpression) yield* visitGroup(child.left);
                        if (child.right instanceof LogicalExpression) yield* visitGroup(child.right);
                        break;

                    default:
                        switch (child.type) {
                            case ExpressionType.Member:

                          
                               

                            case ExpressionType.Method:

                                

                            default:
                                yield child;
                        }
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

        return visit(this.expression);
    }

    public toString(): string {
        return this._footprint; // should be this._expression.toString() sooner or later
    }

    
}