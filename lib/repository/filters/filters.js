"use strict";
const filter_1 = require('./filter');
const lambdaexpression_1 = require('./../../expressions/lambdaexpression');
const reducervisitor_1 = require('./../../expressions/reducervisitor');
class Filters {
    constructor(predicate, ...parameters) {
        this._groups = [];
        var lambda = new lambdaexpression_1.LambdaExpression(predicate), visitor = new reducervisitor_1.ReducerVisitor();
        var expression = visitor.visitLambda(predicate, ...parameters);
        if (visitor.isSolvable == true) {
            if (expression != null && expression.type == reducervisitor_1.ExpressionType.Logical)
                this._groups = filter_1.Filter.visit(expression);
        }
        else {
            throw new Error('Predicate is not solvable');
        }
    }
    get groups() {
        return this._groups;
    }
    getUnion() {
        if (this._groups.length == 0)
            return new Array();
        return this.groups.reduce((res, v, idx, arr) => {
            return new filter_1.Filter(res.criteria.concat(v.criteria));
        }).criteria;
    }
    getIntersection() {
        if (this.groups.length == 0)
            return new Array();
        return this.groups.reduce((res, v, idx, arr) => {
            var criteria = res.criteria.filter((criteria) => {
                for (let crit of v.criteria)
                    if (criteria.property == crit.property && criteria.operator == crit.operator && criteria.value == crit.value)
                        return true;
                return false;
            });
            return new filter_1.Filter(criteria);
        }).criteria;
    }
}
exports.Filters = Filters;
//# sourceMappingURL=filters.js.map