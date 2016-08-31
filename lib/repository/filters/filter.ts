import { IExpression, ExpressionType, ILogicalExpression, LogicalOperatorType, IMemberExpression, ILiteralExpression, IIdentifierExpression } from './../../expressions/expressionvisitor';
import { IFilterCriteria, FilterCriteria } from './filtercriteria';

export interface IFilter {
    criteria: Array<IFilterCriteria>
}

export class Filter implements IFilter {
    private _criteria: Array<IFilterCriteria>

    constructor(criteria: Array<IFilterCriteria>) {
        this._criteria = criteria;
    }

    public get criteria() {
        return this._criteria;
    }

    public static visit(expression: ILogicalExpression): Array<IFilter> {
        var result: Array<IFilter> = [];

        switch (expression.operator) {
            case LogicalOperatorType.Or:
                [expression.left, expression.right].forEach((expr: IExpression) => {
                    if (expr.type == ExpressionType.Logical) {
                        switch ((<ILogicalExpression>expr).operator) {
                            case LogicalOperatorType.Or:
                                result = result.concat((Filter.visit(<ILogicalExpression>expr))); break;

                            default:
                                result.push(new Filter(FilterCriteria.visit(<ILogicalExpression>expr))); break;
                        }
                    }

                });

                break;
            default:
                result.push(new Filter(FilterCriteria.visit(<ILogicalExpression>expression)));
                break;

        }

        // return only filters that has one or more criteria
        return result.filter((filter) => {
            return filter.criteria.length > 0
        });
    }
}