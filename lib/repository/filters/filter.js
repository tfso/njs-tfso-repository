"use strict";
var expressionvisitor_1 = require('./../../expressions/expressionvisitor');
var filtercriteria_1 = require('./filtercriteria');
var Filter = (function () {
    function Filter(criteria) {
        this._criteria = criteria;
    }
    Object.defineProperty(Filter.prototype, "criteria", {
        get: function () {
            return this._criteria;
        },
        enumerable: true,
        configurable: true
    });
    Filter.visit = function (expression) {
        var result = [];
        switch (expression.operator) {
            case expressionvisitor_1.LogicalOperatorType.Or:
                [expression.left, expression.right].forEach(function (expr) {
                    if (expr.type == expressionvisitor_1.ExpressionType.Logical) {
                        switch (expr.operator) {
                            case expressionvisitor_1.LogicalOperatorType.Or:
                                result = result.concat((Filter.visit(expr)));
                                break;
                            default:
                                result.push(new Filter(filtercriteria_1.FilterCriteria.visit(expr)));
                                break;
                        }
                    }
                });
                break;
            default:
                result.push(new Filter(filtercriteria_1.FilterCriteria.visit(expression)));
                break;
        }
        // return only filters that has one or more criteria
        return result.filter(function (filter) {
            return filter.criteria.length > 0;
        });
    };
    return Filter;
}());
exports.Filter = Filter;
//# sourceMappingURL=filter.js.map