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
    protected _it: Object
    private _isSolvable: boolean;

    private _parentExpressionStack: Array<IExpression> = [];

    constructor(it?: Object, ...param: Array<any>) {
        super();

        this._it = it || {};
        this._params = param || null;
    }

    public get it(): string {
        return this._lambdaExpression != null ? this._lambdaExpression.parameters[0] : null;
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
        let parent = this.stack.peek();

        if (parent.type != ExpressionType.Member)
        {
            let it = Object.assign({}, this._it /* global/this variables */, this.getInputParameters() /* special case for javascript function */);
            
            let value = this.evaluate(expression, it);
            if (value != null)
            {
                return new LiteralExpression(value);
            }
            else
            {
                this._isSolvable = false;
            }
        }

        return new IdentifierExpression(expression.name);
    }

    public visitMember(expression: IMemberExpression): IExpression {
        let expr: IMemberExpression;

        expr = new MemberExpression(expression.object.accept(this), expression.property.accept(this));

        if (this.stack.peek().type != ExpressionType.Member)
        {
            let it = Object.assign({},
                this._it /* global/this variables */,
                (expr.object.type == ExpressionType.Identifier && (<IIdentifierExpression>expr.object).name != this.it) ? this.getInputParameters() /* special case for javascript function */ : {}
            );
            
            let value = this.evaluate(expr, it);
            if (value != null)
                return new LiteralExpression(value);
            else
            {
                if(expr.object.type == ExpressionType.Identifier && (<IIdentifierExpression>expr.object).name != this.it)
                    this._isSolvable = false;
            }
        }

        return expr;
    }

    public visitMethod(expression: IMethodExpression): IExpression {
        let expr: IMethodExpression,
            value: any;

        expr = new MethodExpression(expression.name, expression.parameters.map((arg) => arg.accept(this)), expression.caller);

        return expr;
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
                if (left.type == ExpressionType.Literal && (<LiteralExpression>left).value === true) return right;
                if (right.type == ExpressionType.Literal && (<LiteralExpression>right).value === true) return left;

                break;

            case LogicalOperatorType.Or:
                if (left.type == ExpressionType.Literal && (<LiteralExpression>left).value === true) return left;
                if (right.type == ExpressionType.Literal && (<LiteralExpression>right).value === true) return right;

                break;
        }

        return new LogicalExpression(expression.operator, left, right);
    }

    protected evaluate(expression: IExpression, it: Object = null): any {
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

                if (it != null) {
                    // this object
                    if (it.hasOwnProperty(identifier.name) && (value = it[identifier.name]) != null) {
                        switch (typeof value) {
                            case 'string':
                            case 'number':
                                break;

                            case 'object':
                                if (value.getTime && value.getTime() >= 0)
                                    break;

                            // fall through

                            default:
                                value = null;
                        }
                    }
                }  

                break;

            case ExpressionType.Member:
                let object = (<IMemberExpression>expression).object,
                    property = (<IMemberExpression>expression).property;

                if (object.type == ExpressionType.Identifier)
                {
                    
                    if ((<IIdentifierExpression>object).name == 'this' || (<IIdentifierExpression>object).name == this.it)
                    {
                        value = this.evaluate(property, it);
                    }
                    else
                    {
                        let descriptor = Object.getOwnPropertyDescriptor(it, (<IIdentifierExpression>object).name);
                        if (descriptor && typeof descriptor.value == 'object')
                        {
                            value = this.evaluate(property, descriptor.value);
                        }
                    }
                }


                break;                
        }

        return value;
    }

    private getInputParameters(): {} {
        if (this._lambdaExpression && this._lambdaExpression.parameters.length > 0)
            return this._lambdaExpression.parameters.reduce((res, val, index) => {
                if (index > 0 && index <= this._params.length)
                    res[val] = this._params[index - 1]

                return res;
            }, {})

        return {}
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