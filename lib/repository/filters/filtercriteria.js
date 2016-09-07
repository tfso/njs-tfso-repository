"use strict";
var expressionvisitor_1 = require('./../../expressions/expressionvisitor');
var FilterCriteria = (function () {
    function FilterCriteria(expression) {
        this._expression = expression;
    }
    Object.defineProperty(FilterCriteria.prototype, "expression", {
        get: function () {
            return this._expression;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterCriteria.prototype, "property", {
        get: function () {
            switch (this._expression.left.type) {
                case expressionvisitor_1.ExpressionType.Member:
                    return this._expression.left.property.name;
                case expressionvisitor_1.ExpressionType.Literal:
                    switch (this._expression.right.type) {
                        case expressionvisitor_1.ExpressionType.Member:
                            return this._expression.right.property.name;
                        default:
                            return "";
                    }
                default:
                    return "";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterCriteria.prototype, "operator", {
        get: function () {
            switch (this._expression.left.type) {
                case expressionvisitor_1.ExpressionType.Member:
                    switch (this._expression.operator) {
                        case expressionvisitor_1.LogicalOperatorType.Equal:
                            return "==";
                        case expressionvisitor_1.LogicalOperatorType.NotEqual:
                            return "!=";
                        case expressionvisitor_1.LogicalOperatorType.Greater:
                            return ">";
                        case expressionvisitor_1.LogicalOperatorType.GreaterOrEqual:
                            return ">=";
                        case expressionvisitor_1.LogicalOperatorType.Lesser:
                            return "<";
                        case expressionvisitor_1.LogicalOperatorType.LesserOrEqual:
                            return "<=";
                    }
                    return null;
                case expressionvisitor_1.ExpressionType.Literal:
                    switch (this._expression.operator) {
                        case expressionvisitor_1.LogicalOperatorType.Equal:
                            return "==";
                        case expressionvisitor_1.LogicalOperatorType.NotEqual:
                            return "!=";
                        case expressionvisitor_1.LogicalOperatorType.Greater:
                            return "<";
                        case expressionvisitor_1.LogicalOperatorType.GreaterOrEqual:
                            return "<=";
                        case expressionvisitor_1.LogicalOperatorType.Lesser:
                            return ">";
                        case expressionvisitor_1.LogicalOperatorType.LesserOrEqual:
                            return ">=";
                    }
                    break;
                default:
                    return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterCriteria.prototype, "value", {
        get: function () {
            switch (this._expression.left.type) {
                case expressionvisitor_1.ExpressionType.Literal:
                    return this._expression.left.value;
                case expressionvisitor_1.ExpressionType.Member:
                    switch (this._expression.right.type) {
                        case expressionvisitor_1.ExpressionType.Literal:
                            return this._expression.right.value;
                        default:
                            return null;
                    }
                default:
                    return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterCriteria.prototype, "isValid", {
        get: function () {
            // requires "member.property [comparison operator] literal" for now
            switch (this._expression.left.type) {
                case expressionvisitor_1.ExpressionType.Member:
                    if (this._expression.left.object.type == expressionvisitor_1.ExpressionType.Identifier && this._expression.left.property.type == expressionvisitor_1.ExpressionType.Identifier) {
                        switch (this._expression.right.type) {
                            case expressionvisitor_1.ExpressionType.Literal:
                                return true;
                            default:
                                return false;
                        }
                    }
                    else {
                        return false;
                    }
                case expressionvisitor_1.ExpressionType.Literal:
                    switch (this._expression.right.type) {
                        case expressionvisitor_1.ExpressionType.Member:
                            if (this._expression.right.object.type == expressionvisitor_1.ExpressionType.Identifier && this._expression.right.property.type == expressionvisitor_1.ExpressionType.Identifier)
                                return true;
                            else
                                return false;
                        default:
                            return false;
                    }
                default:
                    return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    FilterCriteria.visit = function (expression) {
        var result = [];
        switch (expression.operator) {
            case expressionvisitor_1.LogicalOperatorType.Or:
                return result;
            case expressionvisitor_1.LogicalOperatorType.And:
                if (expression.left.type == expressionvisitor_1.ExpressionType.Logical)
                    result = result.concat(FilterCriteria.visit(expression.left));
                if (expression.right.type == expressionvisitor_1.ExpressionType.Logical)
                    result = result.concat(FilterCriteria.visit(expression.right));
                break;
            default:
                result.push(new FilterCriteria(expression));
                break;
        }
        return result.filter(function (criteria) { return criteria.isValid; });
    };
    return FilterCriteria;
}());
exports.FilterCriteria = FilterCriteria;
//# sourceMappingURL=filtercriteria.js.map