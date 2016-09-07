"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var expression_1 = require('./expression');
var literalexpression_1 = require('./literalexpression');
var binaryexpression_1 = require('./binaryexpression');
var logicalexpression_1 = require('./logicalexpression');
var expressionvisitor_1 = require('./expressionvisitor');
var ReducerVisitor = (function (_super) {
    __extends(ReducerVisitor, _super);
    function ReducerVisitor() {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i - 0] = arguments[_i];
        }
        _super.call(this);
        this._params = param || null;
    }
    Object.defineProperty(ReducerVisitor.prototype, "isSolvable", {
        get: function () {
            return this._isSolvable;
        },
        enumerable: true,
        configurable: true
    });
    ReducerVisitor.prototype.visitLambda = function (predicate) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        this._isSolvable = true; // reset it as checks for solvability is done for each visit
        if (param.length > 0)
            this._params = param;
        return _super.prototype.visitLambda.call(this, predicate);
    };
    ReducerVisitor.prototype.visitIdentifier = function (expression) {
        var obj = this.evaluate(expression);
        if (obj != null) {
            return new literalexpression_1.LiteralExpression(obj);
        }
        else {
            this._isSolvable = false;
        }
        return expression;
    };
    ReducerVisitor.prototype.visitMember = function (expression) {
        var obj;
        if (expression.object.type != expression_1.ExpressionType.Identifier)
            expression.object = expression.object.accept(this);
        if (expression.object.type != expression_1.ExpressionType.Identifier)
            expression.property = expression.property.accept(this);
        var obj = this.evaluate(expression.object);
        if (obj != null && typeof obj == 'object') {
            var idx;
            switch (expression.property.type) {
                case expression_1.ExpressionType.Identifier:
                    idx = expression.property.name;
                    break;
                case expression_1.ExpressionType.Array:
                    if (expression.property.elements.length == 1)
                        idx = this.evaluate(expression.property.elements[0]);
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
            if (expression.object.type == expression_1.ExpressionType.Identifier)
                if (expression.object.name != this._lambdaExpression.parameters[0])
                    this._isSolvable = false;
        }
        return expression;
    };
    ReducerVisitor.prototype.visitBinary = function (expression) {
        expression.left = expression.left.accept(this);
        expression.right = expression.right.accept(this);
        var lvalue = this.evaluate(expression.left);
        var rvalue = this.evaluate(expression.right);
        if (lvalue != null && rvalue != null) {
            switch (expression.operator) {
                case binaryexpression_1.BinaryOperatorType.Addition:
                    return new literalexpression_1.LiteralExpression(lvalue + rvalue);
                case binaryexpression_1.BinaryOperatorType.Subtraction:
                    return new literalexpression_1.LiteralExpression(lvalue - rvalue);
                case binaryexpression_1.BinaryOperatorType.Multiplication:
                    return new literalexpression_1.LiteralExpression(lvalue * rvalue);
                case binaryexpression_1.BinaryOperatorType.Division:
                    return new literalexpression_1.LiteralExpression(lvalue / rvalue);
                case binaryexpression_1.BinaryOperatorType.Modulus:
                    return new literalexpression_1.LiteralExpression(lvalue % rvalue);
                case binaryexpression_1.BinaryOperatorType.And:
                    return new literalexpression_1.LiteralExpression(lvalue & rvalue);
                case binaryexpression_1.BinaryOperatorType.Or:
                    return new literalexpression_1.LiteralExpression(lvalue | rvalue);
                case binaryexpression_1.BinaryOperatorType.ExclusiveOr:
                    return new literalexpression_1.LiteralExpression(lvalue ^ rvalue);
                case binaryexpression_1.BinaryOperatorType.LeftShift:
                    return new literalexpression_1.LiteralExpression(lvalue << rvalue);
                case binaryexpression_1.BinaryOperatorType.RightShift:
                    return new literalexpression_1.LiteralExpression(lvalue >> rvalue);
            }
        }
        return expression;
    };
    ReducerVisitor.prototype.visitLogical = function (expression) {
        expression.left = expression.left.accept(this);
        expression.right = expression.right.accept(this);
        var lvalue = this.evaluate(expression.left);
        var rvalue = this.evaluate(expression.right);
        if (lvalue != null && rvalue != null) {
            switch (expression.operator) {
                case logicalexpression_1.LogicalOperatorType.Equal:
                    return new literalexpression_1.LiteralExpression(lvalue == rvalue);
                case logicalexpression_1.LogicalOperatorType.NotEqual:
                    return new literalexpression_1.LiteralExpression(lvalue != rvalue);
                case logicalexpression_1.LogicalOperatorType.And:
                    return new literalexpression_1.LiteralExpression(lvalue && rvalue);
                case logicalexpression_1.LogicalOperatorType.Or:
                    return new literalexpression_1.LiteralExpression(lvalue || rvalue);
                case logicalexpression_1.LogicalOperatorType.Greater:
                    return new literalexpression_1.LiteralExpression(lvalue > rvalue);
                case logicalexpression_1.LogicalOperatorType.GreaterOrEqual:
                    return new literalexpression_1.LiteralExpression(lvalue >= rvalue);
                case logicalexpression_1.LogicalOperatorType.Lesser:
                    return new literalexpression_1.LiteralExpression(lvalue < rvalue);
                case logicalexpression_1.LogicalOperatorType.LesserOrEqual:
                    return new literalexpression_1.LiteralExpression(lvalue <= rvalue);
            }
        }
        else {
            switch (expression.operator) {
                case logicalexpression_1.LogicalOperatorType.And:
                    if (lvalue === true)
                        return expression.right;
                    if (rvalue === true)
                        return expression.left;
                    break;
            }
        }
        return expression;
    };
    ReducerVisitor.prototype.evaluate = function (expression) {
        var value = null;
        switch (expression.type) {
            case expression_1.ExpressionType.Literal:
                var literal = expression;
                // check for number
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
    };
    return ReducerVisitor;
}(expressionvisitor_1.ExpressionVisitor));
exports.ReducerVisitor = ReducerVisitor;
var expression_2 = require('./expression');
exports.Expression = expression_2.Expression;
exports.ExpressionType = expression_2.ExpressionType;
var literalexpression_2 = require('./literalexpression');
exports.LiteralExpression = literalexpression_2.LiteralExpression;
var identifierexpression_1 = require('./identifierexpression');
exports.IdentifierExpression = identifierexpression_1.IdentifierExpression;
var memberexpression_1 = require('./memberexpression');
exports.MemberExpression = memberexpression_1.MemberExpression;
var methodexpression_1 = require('./methodexpression');
exports.MethodExpression = methodexpression_1.MethodExpression;
var unaryexpression_1 = require('./unaryexpression');
exports.UnaryExpression = unaryexpression_1.UnaryExpression;
exports.UnaryOperatorType = unaryexpression_1.UnaryOperatorType;
exports.UnaryAffixType = unaryexpression_1.UnaryAffixType;
var binaryexpression_2 = require('./binaryexpression');
exports.BinaryExpression = binaryexpression_2.BinaryExpression;
exports.BinaryOperatorType = binaryexpression_2.BinaryOperatorType;
var logicalexpression_2 = require('./logicalexpression');
exports.LogicalExpression = logicalexpression_2.LogicalExpression;
exports.LogicalOperatorType = logicalexpression_2.LogicalOperatorType;
var arrayexpression_1 = require('./arrayexpression');
exports.ArrayExpression = arrayexpression_1.ArrayExpression;
//# sourceMappingURL=reducervisitor.js.map