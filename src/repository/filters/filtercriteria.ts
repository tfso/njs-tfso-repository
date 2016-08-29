import { IExpression, ExpressionType, ILogicalExpression, LogicalOperatorType, IMemberExpression, ILiteralExpression, IIdentifierExpression } from './../../expressions/expressionvisitor';

export interface IFilterCriteria {
    property: string
    operator: string
    value: any

    isValid: boolean
}

export class FilterCriteria implements IFilterCriteria {
    private _expression: ILogicalExpression;

    constructor(expression: ILogicalExpression) {
        this._expression = expression;
    }

    protected get expression() {
        return this._expression;
    }

    public get property() {
        switch (this._expression.left.type) {
            case ExpressionType.Member:
                return (<IIdentifierExpression>(<IMemberExpression>this._expression.left).property).name;

            case ExpressionType.Literal:

                switch (this._expression.right.type) {
                    case ExpressionType.Member:
                        return (<IIdentifierExpression>(<IMemberExpression>this._expression.right).property).name;

                    default:
                        return "";

                }

            default:
                return "";
        }
    }

    public get operator() {
        switch (this._expression.left.type) {
            case ExpressionType.Member:
                switch (this._expression.operator) {
                    case LogicalOperatorType.Equal:
                        return "==";

                    case LogicalOperatorType.NotEqual:
                        return "!=";

                    case LogicalOperatorType.Greater:
                        return ">";

                    case LogicalOperatorType.GreaterOrEqual:
                        return ">=";

                    case LogicalOperatorType.Lesser:
                        return "<";

                    case LogicalOperatorType.LesserOrEqual:
                        return "<=";
                }

                return null;

            case ExpressionType.Literal:
                switch (this._expression.operator) {
                    case LogicalOperatorType.Equal:
                        return "==";

                    case LogicalOperatorType.NotEqual:
                        return "!=";

                    case LogicalOperatorType.Greater:
                        return "<";

                    case LogicalOperatorType.GreaterOrEqual:
                        return "<=";

                    case LogicalOperatorType.Lesser:
                        return ">";

                    case LogicalOperatorType.LesserOrEqual:
                        return ">=";
                }

                break;

            default:
                return null;
        }
    }

    public get value() {
        switch (this._expression.left.type) {
            case ExpressionType.Literal:
                return (<ILiteralExpression>this._expression.left).value;

            case ExpressionType.Member:

                switch (this._expression.right.type) {
                    case ExpressionType.Literal:
                        return (<ILiteralExpression>this._expression.right).value;

                    default:
                        return null;
                }

            default:
                return null;
        }
    }

    public get isValid() {
        // requires "member.property [comparison operator] literal" for now

        switch (this._expression.left.type) {
            case ExpressionType.Member:

                if ((<IMemberExpression>this._expression.left).object.type == ExpressionType.Identifier && (<IMemberExpression>this._expression.left).property.type == ExpressionType.Identifier) {

                    switch (this._expression.right.type) {
                        case ExpressionType.Literal:
                            return true;

                        default:
                            return false;
                    }

                } else {
                    return false;
                }

            case ExpressionType.Literal:

                switch (this._expression.right.type) {
                    case ExpressionType.Member:
                        if ((<IMemberExpression>this._expression.right).object.type == ExpressionType.Identifier && (<IMemberExpression>this._expression.right).property.type == ExpressionType.Identifier)
                            return true;
                        else
                            return false;

                    default:
                        return false;
                }

            default:
                return false;
        }
    }

    public static visit(expression: ILogicalExpression): Array<IFilterCriteria> {
        var result: Array<IFilterCriteria> = [];

        if (expression.operator == LogicalOperatorType.Or)
            return result;

        switch (expression.operator) {
            case LogicalOperatorType.Or:

                break;

            case LogicalOperatorType.And:
                if (expression.left.type == ExpressionType.Logical)
                    result = result.concat(FilterCriteria.visit(<ILogicalExpression>expression.left));

                if (expression.right.type == ExpressionType.Logical)
                    result = result.concat(FilterCriteria.visit(<ILogicalExpression>expression.right));

                break;

            default:
                result.push(new FilterCriteria(expression));
                break;
        }

        return result.filter((criteria) => criteria.isValid);
    }

}