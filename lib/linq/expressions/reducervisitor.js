"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
const literalexpression_1 = require("./literalexpression");
const methodexpression_1 = require("./methodexpression");
const binaryexpression_1 = require("./binaryexpression");
const logicalexpression_1 = require("./logicalexpression");
const conditionalexpression_1 = require("./conditionalexpression");
const arrayexpression_1 = require("./arrayexpression");
const expressionvisitor_1 = require("./expressionvisitor");
class ReducerVisitor extends expressionvisitor_1.ExpressionVisitor {
    constructor() {
        super();
        this._parentExpressionStack = [];
        this._it = null;
    }
    get it() {
        return this._it;
    }
    visitLambda(predicate, ...param) {
        //this._isSolvable = true; // reset it as checks for solvability is done for each visit
        this._it = null; // do not involve "this" at the moment, since evalute is using "ReducerVisitor.it" to find out the named "this" scope.
        let expr = super.visitLambda(predicate), vars = null;
        if (param.length > 0) {
            if (this._lambdaExpression && this._lambdaExpression.parameters.length > 0) {
                vars = this._lambdaExpression.parameters.reduce((res, val, index) => {
                    if (index > 0 && index <= param.length)
                        res[val] = param[index - 1];
                    return res;
                }, {});
            }
        }
        expr = this.evaluate.call(this, expr, vars);
        this._it = this._lambdaExpression != null && this._lambdaExpression.parameters.length > 0 ? this._lambdaExpression.parameters[0] : null;
        return expr;
    }
    visitLiteral(expression) {
        return this.evaluate(expression);
    }
    visitMethod(expression) {
        let expr, value;
        expr = new methodexpression_1.MethodExpression(expression.name, expression.parameters.map((arg) => arg.accept(this)), expression.caller);
        return expr;
    }
    visitBinary(expression) {
        let left = expression.left, right = expression.right;
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
        return new binaryexpression_1.BinaryExpression(expression.operator, left.accept(this), right.accept(this));
    }
    visitConditional(expression) {
        let condition = expression.condition.accept(this);
        if (condition.type == expression_1.ExpressionType.Literal) {
            if (condition.value === true)
                return expression.success.accept(this);
            else
                return expression.failure.accept(this);
        }
        return new conditionalexpression_1.ConditionalExpression(condition, expression.success.accept(this), expression.failure.accept(this));
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
        if (expression == null)
            return null;
        var value = null;
        switch (expression.type) {
            case expression_1.ExpressionType.Literal:
                break;
            case expression_1.ExpressionType.Identifier: {
                var identifier = expression;
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
                                if (Array.isArray(value) == true)
                                    break;
                            // fall through
                            default:
                                value = null;
                        }
                        return new literalexpression_1.LiteralExpression(value);
                    }
                }
                break;
            }
            case expression_1.ExpressionType.Array:
                return new arrayexpression_1.ArrayExpression(expression.elements.map(v => this.evaluate(v, it)));
            case expression_1.ExpressionType.Index: {
                let object = this.evaluate(expression.object, it), index = this.evaluate(expression.index, it);
                if (index.type == expression_1.ExpressionType.Literal)
                    switch (object.type) {
                        case expression_1.ExpressionType.Array:
                            return Array.from(object.elements)[index.value];
                        case expression_1.ExpressionType.Literal:
                            return new literalexpression_1.LiteralExpression(Array.from(object.value)[index.value]);
                    }
                break;
            }
            case expression_1.ExpressionType.Member: {
                let object = expression.object, property = expression.property;
                if (it != null) {
                    if (object.type == expression_1.ExpressionType.Identifier) {
                        if (object.name == 'this' || object.name == this.it) {
                            value = this.evaluate(property, it);
                            if (property.equal(value) == false)
                                return value;
                        }
                        else {
                            let descriptor = Object.getOwnPropertyDescriptor(it, object.name);
                            if (descriptor && typeof descriptor.value == 'object') {
                                value = this.evaluate(property, descriptor.value);
                                if (property.equal(value) == false)
                                    return value;
                            }
                        }
                    }
                }
                break;
            }
            case expression_1.ExpressionType.Conditional:
                return this.visit(new conditionalexpression_1.ConditionalExpression(this.evaluate(expression.condition, it), this.evaluate(expression.success, it), this.evaluate(expression.failure, it)));
            case expression_1.ExpressionType.Logical:
                return this.visit(new logicalexpression_1.LogicalExpression(expression.operator, this.evaluate(expression.left, it), this.evaluate(expression.right, it)));
            case expression_1.ExpressionType.Binary:
                return this.visit(new binaryexpression_1.BinaryExpression(expression.operator, this.evaluate(expression.left, it), this.evaluate(expression.right, it)));
            case expression_1.ExpressionType.Method:
                return this.visit(new methodexpression_1.MethodExpression(expression.name, expression.parameters.map(p => this.evaluate(p, it)), this.evaluate(expression.caller, it)));
            default:
                let o = Object.create(Object.getPrototypeOf(expression), Object.getOwnPropertyNames(expression).reduce((prev, cur) => {
                    let prop = Object.getOwnPropertyDescriptor(expression, cur);
                    if (prop.value instanceof expression_1.Expression)
                        prop.value = this.evaluate(prop.value, it);
                    else if (prop.value instanceof Array)
                        prop.value = prop.value.map(a => a instanceof expression_1.Expression ? this.evaluate(a, it) : a);
                    prev[cur] = prop;
                    return prev;
                }, {}));
                return this.visit(o);
        }
        return expression;
    }
    static evaluate(expression, it = null) {
        let reducer = new ReducerVisitor(), result = reducer.evaluate(expression, it);
        return result.type == expression_1.ExpressionType.Literal ? result.value : undefined;
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
var memberexpression_1 = require("./memberexpression");
exports.MemberExpression = memberexpression_1.MemberExpression;
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
var arrayexpression_2 = require("./arrayexpression");
exports.ArrayExpression = arrayexpression_2.ArrayExpression;
//# sourceMappingURL=reducervisitor.js.map