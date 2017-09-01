"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
const literalexpression_1 = require("./literalexpression");
const identifierexpression_1 = require("./identifierexpression");
const memberexpression_1 = require("./memberexpression");
const methodexpression_1 = require("./methodexpression");
const binaryexpression_1 = require("./binaryexpression");
const logicalexpression_1 = require("./logicalexpression");
const expressionvisitor_1 = require("./expressionvisitor");
class ReducerVisitor extends expressionvisitor_1.ExpressionVisitor {
    constructor(...param) {
        super();
        this._parentExpressionStack = [];
        this._params = param || null;
    }
    get it() {
        return this._lambdaExpression != null ? this._lambdaExpression.parameters[0] : null;
    }
    get isSolvable() {
        return this._isSolvable;
    }
    visitLambda(predicate, ...param) {
        this._isSolvable = true; // reset it as checks for solvability is done for each visit
        if (param.length > 0)
            this._params = param;
        return super.visitLambda(predicate);
    }
    visitLiteral(expression) {
        let value = this.evaluate(expression);
        return new literalexpression_1.LiteralExpression(value);
    }
    visitIdentifier(expression) {
        let parent = this.stack.peek();
        if (parent.type != expression_1.ExpressionType.Member) {
            let value = this.evaluate(expression);
            if (value != null) {
                return new literalexpression_1.LiteralExpression(value);
            }
        }
        return new identifierexpression_1.IdentifierExpression(expression.name);
    }
    visitMember(expression) {
        let expr;
        expr = new memberexpression_1.MemberExpression(expression.object.accept(this), expression.property.accept(this));
        if (this.stack.peek().type != expression_1.ExpressionType.Member) {
            let value = this.evaluate(expr);
            if (value != null)
                return new literalexpression_1.LiteralExpression(value);
        }
        return expr;
    }
    visitMethod(expression) {
        let expr, value;
        expr = new methodexpression_1.MethodExpression(expression.name, expression.parameters.map((arg) => arg.accept(this)), expression.caller);
        return expr;
    }
    visitBinary(expression) {
        let left = expression.left.accept(this), right = expression.right.accept(this);
        if (left.type == expression_1.ExpressionType.Literal && right.type == expression_1.ExpressionType.Literal) {
            let leftValue = left.value, rightValue = right.value;
            switch (expression.operator) {
                case binaryexpression_1.BinaryOperatorType.Addition:
                    return new literalexpression_1.LiteralExpression(leftValue + rightValue);
                case binaryexpression_1.BinaryOperatorType.Subtraction:
                    return new literalexpression_1.LiteralExpression(leftValue - rightValue);
                case binaryexpression_1.BinaryOperatorType.Multiplication:
                    return new literalexpression_1.LiteralExpression(leftValue * rightValue);
                case binaryexpression_1.BinaryOperatorType.Division:
                    return new literalexpression_1.LiteralExpression(leftValue / rightValue);
                case binaryexpression_1.BinaryOperatorType.Modulus:
                    return new literalexpression_1.LiteralExpression(leftValue % rightValue);
                case binaryexpression_1.BinaryOperatorType.And:
                    return new literalexpression_1.LiteralExpression(leftValue & rightValue);
                case binaryexpression_1.BinaryOperatorType.Or:
                    return new literalexpression_1.LiteralExpression(leftValue | rightValue);
                case binaryexpression_1.BinaryOperatorType.ExclusiveOr:
                    return new literalexpression_1.LiteralExpression(leftValue ^ rightValue);
                case binaryexpression_1.BinaryOperatorType.LeftShift:
                    return new literalexpression_1.LiteralExpression(leftValue << rightValue);
                case binaryexpression_1.BinaryOperatorType.RightShift:
                    return new literalexpression_1.LiteralExpression(leftValue >> rightValue);
            }
        }
        return new binaryexpression_1.BinaryExpression(expression.operator, left, right);
    }
    visitLogical(expression) {
        let left = expression.left.accept(this), right = expression.right.accept(this);
        if (left.type == expression_1.ExpressionType.Literal && right.type == expression_1.ExpressionType.Literal) {
            let leftValue = left.value, rightValue = right.value;
            switch (expression.operator) {
                case logicalexpression_1.LogicalOperatorType.Equal:
                    return new literalexpression_1.LiteralExpression(leftValue == rightValue);
                case logicalexpression_1.LogicalOperatorType.NotEqual:
                    return new literalexpression_1.LiteralExpression(leftValue != rightValue);
                case logicalexpression_1.LogicalOperatorType.And:
                    return new literalexpression_1.LiteralExpression(leftValue && rightValue);
                case logicalexpression_1.LogicalOperatorType.Or:
                    return new literalexpression_1.LiteralExpression(leftValue || rightValue);
                case logicalexpression_1.LogicalOperatorType.Greater:
                    return new literalexpression_1.LiteralExpression(leftValue > rightValue);
                case logicalexpression_1.LogicalOperatorType.GreaterOrEqual:
                    return new literalexpression_1.LiteralExpression(leftValue >= rightValue);
                case logicalexpression_1.LogicalOperatorType.Lesser:
                    return new literalexpression_1.LiteralExpression(leftValue < rightValue);
                case logicalexpression_1.LogicalOperatorType.LesserOrEqual:
                    return new literalexpression_1.LiteralExpression(leftValue <= rightValue);
            }
        }
        switch (expression.operator) {
            case logicalexpression_1.LogicalOperatorType.And:
                if (left.type == expression_1.ExpressionType.Literal && left.value === true)
                    return right;
                if (right.type == expression_1.ExpressionType.Literal && right.value === true)
                    return left;
                break;
            case logicalexpression_1.LogicalOperatorType.Or:
                if (left.type == expression_1.ExpressionType.Literal && left.value === true)
                    return left;
                if (right.type == expression_1.ExpressionType.Literal && right.value === true)
                    return right;
                break;
        }
        return new logicalexpression_1.LogicalExpression(expression.operator, left, right);
    }
    evaluate(expression, it = null) {
        var value = null;
        switch (expression.type) {
            case expression_1.ExpressionType.Literal:
                var literal = expression;
                if (typeof (value = literal.value) == 'string') {
                    if (/^[+-]?[0-9]*(\.[0-9]+)?$/i.test(literal.value) == true)
                        value = parseFloat(literal.value);
                    else if (literal.value == "true" || literal.value == "false")
                        value = literal.value == "true" ? true : false;
                    else if (isNaN((new Date(literal.value)).getTime()) == false)
                        value = new Date(literal.value);
                    else
                        value = literal.value;
                }
                break;
            case expression_1.ExpressionType.Identifier:
                var identifier = expression;
                var idx = -1;
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
                else if (this._lambdaExpression != null && (idx = this._lambdaExpression.parameters.indexOf(identifier.name) - 1) >= 0) {
                    if (this._params.length >= 0 && this._params.length > idx)
                        value = this._params[idx];
                }
                if (value == null)
                    this._isSolvable = false;
                break;
            case expression_1.ExpressionType.Member:
                let object = expression.object, property = expression.property;
                if (this._lambdaExpression != null) {
                    if (object.type == expression_1.ExpressionType.Identifier && object.name == "this") {
                        it = (this._lambdaExpression.parameters.length == 1 && this._params.length == 1) ? this._params[0] : {};
                        if ((value = this.evaluate(property, it)) == null)
                            this._isSolvable = false;
                    }
                    else {
                        if (object.type == expression_1.ExpressionType.Identifier) {
                            if (object.name != this.it)
                                this._isSolvable = false;
                        }
                    }
                }
                break;
        }
        return value;
    }
}
exports.ReducerVisitor = ReducerVisitor;
var expression_2 = require("./expression");
exports.Expression = expression_2.Expression;
exports.ExpressionType = expression_2.ExpressionType;
var literalexpression_2 = require("./literalexpression");
exports.LiteralExpression = literalexpression_2.LiteralExpression;
var identifierexpression_2 = require("./identifierexpression");
exports.IdentifierExpression = identifierexpression_2.IdentifierExpression;
var memberexpression_2 = require("./memberexpression");
exports.MemberExpression = memberexpression_2.MemberExpression;
var methodexpression_2 = require("./methodexpression");
exports.MethodExpression = methodexpression_2.MethodExpression;
var unaryexpression_1 = require("./unaryexpression");
exports.UnaryExpression = unaryexpression_1.UnaryExpression;
exports.UnaryOperatorType = unaryexpression_1.UnaryOperatorType;
exports.UnaryAffixType = unaryexpression_1.UnaryAffixType;
var binaryexpression_2 = require("./binaryexpression");
exports.BinaryExpression = binaryexpression_2.BinaryExpression;
exports.BinaryOperatorType = binaryexpression_2.BinaryOperatorType;
var logicalexpression_2 = require("./logicalexpression");
exports.LogicalExpression = logicalexpression_2.LogicalExpression;
exports.LogicalOperatorType = logicalexpression_2.LogicalOperatorType;
var arrayexpression_1 = require("./arrayexpression");
exports.ArrayExpression = arrayexpression_1.ArrayExpression;
//# sourceMappingURL=reducervisitor.js.map