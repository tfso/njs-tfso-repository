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
        var obj;

        if (expression.object.type != ExpressionType.Identifier)
            expression.object = expression.object.accept(this);

        if (expression.object.type != ExpressionType.Identifier)
            expression.property = expression.property.accept(this);

        var obj = this.evaluate(expression.object);
        if (obj != null && typeof obj == 'object') {
            var idx;
            switch (expression.property.type) {
                case ExpressionType.Identifier:
                    idx = (<IIdentifierExpression>expression.property).name;

                    break;

                case ExpressionType.Array:
                    if ((<IArrayExpression>expression.property).elements.length == 1)
                        idx = this.evaluate((<IArrayExpression>expression.property).elements[0]);

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
            if (expression.object.type == ExpressionType.Identifier)
                if ((<IIdentifierExpression>expression.object).name != this._lambdaExpression.parameters[0])
                    this._isSolvable = false;
        }

        return expression;
    }

    public visitBinary(expression: IBinaryExpression): IExpression {
        expression.left = expression.left.accept(this);
        expression.right = expression.right.accept(this);

        var lvalue = this.evaluate(expression.left);
        var rvalue = this.evaluate(expression.right);

        if (lvalue != null && rvalue != null) {
            switch (expression.operator) {
                case BinaryOperatorType.Addition:
                    return new LiteralExpression(lvalue + rvalue);

                case BinaryOperatorType.Subtraction:
                    return new LiteralExpression(lvalue - rvalue);

                case BinaryOperatorType.Multiplication:
                    return new LiteralExpression(lvalue * rvalue);

                case BinaryOperatorType.Division:
                    return new LiteralExpression(lvalue / rvalue);

                case BinaryOperatorType.Modulus:
                    return new LiteralExpression(lvalue % rvalue);

                case BinaryOperatorType.And:
                    return new LiteralExpression(lvalue & rvalue);

                case BinaryOperatorType.Or:
                    return new LiteralExpression(lvalue | rvalue);

                case BinaryOperatorType.ExclusiveOr:
                    return new LiteralExpression(lvalue ^ rvalue);

                case BinaryOperatorType.LeftShift:
                    return new LiteralExpression(lvalue << rvalue);

                case BinaryOperatorType.RightShift:
                    return new LiteralExpression(lvalue >> rvalue);
            }
        }

        return expression;
    }

    public visitLogical(expression: ILogicalExpression): IExpression {
        expression.left = expression.left.accept(this);
        expression.right = expression.right.accept(this);

        var lvalue = this.evaluate(expression.left);
        var rvalue = this.evaluate(expression.right);

        if (lvalue != null && rvalue != null) {
            switch (expression.operator) {
                case LogicalOperatorType.Equal:


                    return new LiteralExpression(lvalue == rvalue);
                case LogicalOperatorType.NotEqual:
                    return new LiteralExpression(lvalue != rvalue);
                case LogicalOperatorType.And:
                    return new LiteralExpression(lvalue && rvalue);
                case LogicalOperatorType.Or:
                    return new LiteralExpression(lvalue || rvalue);
                case LogicalOperatorType.Greater:
                    return new LiteralExpression(lvalue > rvalue);
                case LogicalOperatorType.GreaterOrEqual:
                    return new LiteralExpression(lvalue >= rvalue);
                case LogicalOperatorType.Lesser:
                    return new LiteralExpression(lvalue < rvalue);
                case LogicalOperatorType.LesserOrEqual:
                    return new LiteralExpression(lvalue <= rvalue);
            }
        } else {
            switch (expression.operator) {
                case LogicalOperatorType.And:
                    if (lvalue === true) return expression.right;
                    if (rvalue === true) return expression.left;

                    break;
            }
        }

        return expression;
    }

    private evaluate(expression: IExpression): any {
        var value: any = null;

        switch (expression.type) {
            case ExpressionType.Literal:
                var literal = (<ILiteralExpression>expression);

                // check for number
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