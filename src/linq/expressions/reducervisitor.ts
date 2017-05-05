import { IExpression, Expression, ExpressionType } from './expression';
import { ILiteralExpression, LiteralExpression } from './literalexpression';
import { ICompoundExpression } from './compoundexpression';
import { IIdentifierExpression, IdentifierExpression } from './identifierexpression';
import { IMemberExpression, MemberExpression } from './memberexpression';
import { IMethodExpression, MethodExpression } from './methodexpression';
import { IUnaryExpression, UnaryExpression, UnaryOperatorType, UnaryAffixType } from './unaryexpression';
import { IBinaryExpression, BinaryExpression, BinaryOperatorType } from './binaryexpression';
import { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './logicalexpression';
import { IConditionalExpression } from './conditionalexpression';
import { IArrayExpression, ArrayExpression } from './arrayexpression';

import { LambdaExpression } from './lambdaexpression';
import { ExpressionVisitor } from './expressionvisitor';

export class ReducerVisitor extends ExpressionVisitor {
    private _params: Array<any>
    private _isSolvable: boolean;

    constructor(...param: Array<any>) {
        super();

        this._params = param || null;
    }

    public get isSolvable(): boolean {
        return this._isSolvable;
    }

    public visitLambda(predicate: (it: Object, ...param: Array<any>) => any, ...param: Array<any>): IExpression {
        this._isSolvable = true; // reset it as checks for solvability is done for each visit

        if (param.length > 0)
            this._params = param;

        return super.visitLambda(predicate);
    }

    public visitLiteral(expression: ILiteralExpression): IExpression {
        let value = this.evaluate(expression);

        return new LiteralExpression(value);
    }

    public visitIdentifier(expression: IIdentifierExpression): IExpression {
        var obj = this.evaluate(expression);

        if (obj != null) {
            return new LiteralExpression(obj);
        } else {
            this._isSolvable = false;
        }

        return expression;
    }

    public visitMember(expression: IMemberExpression): IExpression {
        let object, property;

        if ((object = expression.object).type != ExpressionType.Identifier)
            object = expression.object.accept(this);

        if ((property = expression.property).type != ExpressionType.Identifier)
            property = expression.property.accept(this);

        let obj = this.evaluate(object);

        if (obj != null && typeof obj == 'object') {
            var idx;
            switch (property.type) {
                case ExpressionType.Identifier:
                    idx = (<IIdentifierExpression>property).name;

                    break;

                case ExpressionType.Array:
                    if ((<IArrayExpression>property).elements.length == 1)
                        idx = this.evaluate((<IArrayExpression>property).elements[0]);

                    break;
            }

            if (idx != null) {
                switch (typeof obj[idx]) {
                    case 'string':
                    case 'number':
                        return new LiteralExpression(obj[idx]);

                    case 'object':
                    // check for date

                    default:
                        this._isSolvable = false;
                }
            } else {
                this._isSolvable = false;
            }
        }
        else {
            if (object.type == ExpressionType.Identifier)
                if ((<IIdentifierExpression>object).name != this._lambdaExpression.parameters[0])
                    this._isSolvable = false;
        }

        return new MemberExpression(object, property);
    }

    public visitBinary(expression: IBinaryExpression): IExpression {
        let left = expression.left.accept(this),
            right = expression.right.accept(this);

        if (left.type == ExpressionType.Literal && right.type == ExpressionType.Literal)
        {
            let leftValue = (<LiteralExpression>left).value,
                rightValue = (<LiteralExpression>right).value;

            switch (expression.operator) {
                case BinaryOperatorType.Addition:
                    return new LiteralExpression(leftValue + rightValue);

                case BinaryOperatorType.Subtraction:
                    return new LiteralExpression(leftValue - rightValue);

                case BinaryOperatorType.Multiplication:
                    return new LiteralExpression(leftValue * rightValue);

                case BinaryOperatorType.Division:
                    return new LiteralExpression(leftValue / rightValue);

                case BinaryOperatorType.Modulus:
                    return new LiteralExpression(leftValue % rightValue);

                case BinaryOperatorType.And:
                    return new LiteralExpression(leftValue & rightValue);

                case BinaryOperatorType.Or:
                    return new LiteralExpression(leftValue | rightValue);

                case BinaryOperatorType.ExclusiveOr:
                    return new LiteralExpression(leftValue ^ rightValue);

                case BinaryOperatorType.LeftShift:
                    return new LiteralExpression(leftValue << rightValue);

                case BinaryOperatorType.RightShift:
                    return new LiteralExpression(leftValue >> rightValue);
            }
        }

        return new BinaryExpression(expression.operator, left, right);
    }

    public visitLogical(expression: ILogicalExpression): IExpression {
        let left = expression.left.accept(this),
            right = expression.right.accept(this);

        if (left.type == ExpressionType.Literal && right.type == ExpressionType.Literal) {
            let leftValue = (<LiteralExpression>left).value,
                rightValue = (<LiteralExpression>right).value;

            switch (expression.operator) {
                case LogicalOperatorType.Equal:
                    return new LiteralExpression(leftValue == rightValue);
                case LogicalOperatorType.NotEqual:
                    return new LiteralExpression(leftValue != rightValue);
                case LogicalOperatorType.And:
                    return new LiteralExpression(leftValue && rightValue);
                case LogicalOperatorType.Or:
                    return new LiteralExpression(leftValue || rightValue);
                case LogicalOperatorType.Greater:
                    return new LiteralExpression(leftValue > rightValue);
                case LogicalOperatorType.GreaterOrEqual:
                    return new LiteralExpression(leftValue >= rightValue);
                case LogicalOperatorType.Lesser:
                    return new LiteralExpression(leftValue < rightValue);
                case LogicalOperatorType.LesserOrEqual:
                    return new LiteralExpression(leftValue <= rightValue);
            }
        } 

        switch (expression.operator) {
            case LogicalOperatorType.And:
                if (expression.left.type == ExpressionType.Literal && (<LiteralExpression>expression.left).value === true) return right;
                if (expression.right.type == ExpressionType.Literal && (<LiteralExpression>expression.right).value === true) return left;

            default:
                return new LogicalExpression(expression.operator, left, right);
        }
    }

    protected evaluate(expression: IExpression): any {
        var value: any = null;

        switch (expression.type) {
            case ExpressionType.Literal:
                var literal = (<ILiteralExpression>expression);

                if (typeof (value = literal.value) == 'string') {
                    if (/^[+-]?[0-9]*(\.[0-9]+)?$/i.test(literal.value) == true)
                        value = parseFloat(literal.value);
                    else if (literal.value == "true" || literal.value == "false")
                        value = literal.value == "true" ? true : false;
                    else if (isNaN((new Date(literal.value)).getTime()) == false) // check for date
                        value = new Date(literal.value);
                    else
                        value = literal.value;
                }

                break;

            case ExpressionType.Identifier:
                var identifier = (<IIdentifierExpression>expression);

                var idx: number = -1;

                if (this._params.length > 0) {

                    if (identifier.name == "this") {
                        if (this._lambdaExpression.parameters.length == 1)
                            return this._params[0];
                    }
                    else {

                        if ((idx = this._lambdaExpression.parameters.indexOf(identifier.name) - 1) >= 0) {
                            if (this._params.length >= 0 && this._params.length > idx)
                                value = this._params[idx];
                        }
                    }
                }

                break;
                
        }

        return value;
    }
}

export { IExpression, Expression, ExpressionType } from './expression';
export { ILiteralExpression, LiteralExpression } from './literalexpression';
export { ICompoundExpression } from './compoundexpression';
export { IIdentifierExpression, IdentifierExpression } from './identifierexpression';
export { IMemberExpression, MemberExpression } from './memberexpression';
export { IMethodExpression, MethodExpression } from './methodexpression';
export { IUnaryExpression, UnaryExpression, UnaryOperatorType, UnaryAffixType } from './unaryexpression';
export { IBinaryExpression, BinaryExpression, BinaryOperatorType } from './binaryexpression';
export { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './logicalexpression';
export { IConditionalExpression } from './conditionalexpression';
export { IArrayExpression, ArrayExpression } from './arrayexpression';