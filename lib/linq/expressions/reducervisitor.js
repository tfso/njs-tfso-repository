"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
const literalexpression_1 = require("./literalexpression");
const memberexpression_1 = require("./memberexpression");
const binaryexpression_1 = require("./binaryexpression");
const logicalexpression_1 = require("./logicalexpression");
const expressionvisitor_1 = require("./expressionvisitor");
class ReducerVisitor extends expressionvisitor_1.ExpressionVisitor {
    constructor(...param) {
        super();
        this._parentExpressionStack = [];
        this._params = param || null;
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
        var obj = this.evaluate(expression);
        if (obj != null) {
            return new literalexpression_1.LiteralExpression(obj);
        }
        else {
            this._isSolvable = false;
        }
        return expression;
    }
    visitMember(expression) {
        let object, property;
        if ((object = expression.object).type != expression_1.ExpressionType.Identifier)
            object = expression.object.accept(this);
        if ((property = expression.property).type != expression_1.ExpressionType.Identifier)
            property = expression.property.accept(this);
        let obj = this.evaluate(object);
        if (obj != null && typeof obj == 'object') {
            var idx;
            switch (property.type) {
                case expression_1.ExpressionType.Identifier:
                    idx = property.name;
                    break;
                case expression_1.ExpressionType.Array:
                    if (property.elements.length == 1)
                        idx = this.evaluate(property.elements[0]);
                    break;
            }
            if (idx != null) {
                switch (typeof obj[idx]) {
                    case 'string':
                    case 'number':
                        return new literalexpression_1.LiteralExpression(obj[idx]);
                    case 'object':
                    // check for date
                    default:
                        this._isSolvable = false;
                }
            }
            else {
                this._isSolvable = false;
            }
        }
        else {
            // no point to find out it's solvable if this MemberExpression is a nested MemberExpression of Parent.
            if (this._lambdaExpression != null && this.stack.peek().type != expression_1.ExpressionType.Member) {
                if (object.type == expression_1.ExpressionType.Identifier) {
                    if (object.name != this._lambdaExpression.parameters[0])
                        this._isSolvable = false;
                }
            }
        }
        return new memberexpression_1.MemberExpression(object, property);
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
                if (expression.left.type == expression_1.ExpressionType.Literal && expression.left.value === true)
                    return right;
                if (expression.right.type == expression_1.ExpressionType.Literal && expression.right.value === true)
                    return left;
            default:
                return new logicalexpression_1.LogicalExpression(expression.operator, left, right);
        }
    }
    evaluate(expression) {
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
exports.ReducerVisitor = ReducerVisitor;
var expression_2 = require("./expression");
exports.Expression = expression_2.Expression;
exports.ExpressionType = expression_2.ExpressionType;
var literalexpression_2 = require("./literalexpression");
exports.LiteralExpression = literalexpression_2.LiteralExpression;
var identifierexpression_1 = require("./identifierexpression");
exports.IdentifierExpression = identifierexpression_1.IdentifierExpression;
var memberexpression_2 = require("./memberexpression");
exports.MemberExpression = memberexpression_2.MemberExpression;
var methodexpression_1 = require("./methodexpression");
exports.MethodExpression = methodexpression_1.MethodExpression;
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