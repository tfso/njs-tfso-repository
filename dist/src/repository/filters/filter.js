"use strict";
const expressionvisitor_1 = require('./../../expressions/expressionvisitor');
const filtercriteria_1 = require('./filtercriteria');
class Filter {
    constructor(criteria) {
        this._criteria = criteria;
    }
    get criteria() {
        return this._criteria;
    }
    static visit(expression) {
        var result = [];
        switch (expression.operator) {
            case expressionvisitor_1.LogicalOperatorType.Or:
                [expression.left, expression.right].forEach((expr) => {
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
        return result.filter((filter) => {
            return filter.criteria.length > 0;
        });
    }
}
exports.Filter = Filter;
//# sourceMappingURL=filter.js.map