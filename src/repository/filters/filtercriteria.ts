import { IExpression, ExpressionType, ILogicalExpression, LogicalOperatorType, IMemberExpression, ILiteralExpression, IIdentifierExpression } from './../../linq/expressions/expressionvisitor';

export interface IFilterCriteria {
    property: string
    operator: string
    value: any
    wildcard: 'none' | 'left' | 'right' | 'both'
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

    protected getMemberName(expression: IExpression): string {
        switch (expression.type)
        {
            case ExpressionType.Identifier:
                return (<IIdentifierExpression>expression).name;

            case ExpressionType.Member:
                return `${this.getMemberName((<IMemberExpression>expression).object)}.${this.getMemberName((<IMemberExpression>expression).property)}`;

            default:
                return '';
        }
    }

    public get property() {
        switch (this._expression.left.type) {
            case ExpressionType.Identifier:
            case ExpressionType.Member:
                return this.getMemberName(this._expression.left);

            case ExpressionType.Literal:

                switch (this._expression.right.type) {
                    case ExpressionType.Identifier:
                    case ExpressionType.Member:
                        return this.getMemberName(this._expression.right);

                    default:
                        return "";

                }

            default:
                return "";
        }
    }

    public get wildcard() {
        let value = String(this.getValue())

        if(value.startsWith('*') && value.endsWith('*')) 
            return 'both'
        else if(value.startsWith('*'))
            return 'left'
        else if(value.endsWith('*'))
            return 'right'
            
        return 'none'
    }

    public get operator() {
        switch (this._expression.left.type) {
            case ExpressionType.Identifier:
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
        return this.cleanWildcard(this.getValue())
    }

    private getValue() {
        switch (this._expression.left.type) {
            case ExpressionType.Literal:
                return (<ILiteralExpression>this._expression.left).value;

            case ExpressionType.Identifier:
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
            case ExpressionType.Identifier:
                switch (this._expression.right.type) {
                    case ExpressionType.Literal:
                        return true;

                    default:
                        return false;
                }

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

        switch (expression.operator) {
            case LogicalOperatorType.Or:
                return result;

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

    private cleanWildcard(value: any) {
        if(typeof value == 'string') {

            let match = /^\*?(.*?)\*?$/.exec(value)
            if(match) {
                return match[1]
            }

            return value
        }

        return value
    }
}