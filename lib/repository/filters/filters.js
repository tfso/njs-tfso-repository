"use strict";
var filter_1 = require('./filter');
var lambdaexpression_1 = require('./../../expressions/lambdaexpression');
var reducervisitor_1 = require('./../../expressions/reducervisitor');
var Filters = (function () {
    function Filters(predicate) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        this._groups = [];
        var lambda = new lambdaexpression_1.LambdaExpression(predicate), visitor = new reducervisitor_1.ReducerVisitor();
        var expression = visitor.visitLambda.apply(visitor, [predicate].concat(parameters));
        if (visitor.isSolvable == true) {
            if (expression != null && expression.type == reducervisitor_1.ExpressionType.Logical)
                this._groups = filter_1.Filter.visit(expression);
        }
        else {
            throw new Error('Predicate is not solvable');
        }
    }
    Object.defineProperty(Filters.prototype, "groups", {
        get: function () {
            return this._groups;
        },
        enumerable: true,
        configurable: true
    });
    Filters.prototype.getUnion = function () {
        if (this._groups.length == 0)
            return new Array();
        return this.groups.reduce(function (res, v, idx, arr) {
            return new filter_1.Filter(res.criteria.concat(v.criteria));
        }).criteria;
    };
    Filters.prototype.getIntersection = function () {
        if (this.groups.length == 0)
            return new Array();
        return this.groups.reduce(function (res, v, idx, arr) {
            var criteria = res.criteria.filter(function (criteria) {
                for (var _i = 0, _a = v.criteria; _i < _a.length; _i++) {
                    var crit = _a[_i];
                    if (criteria.property == crit.property && criteria.operator == crit.operator && criteria.value == crit.value)
                        return true;
                }
                return false;
            });
            return new filter_1.Filter(criteria);
        }).criteria;
    };
    return Filters;
}());
exports.Filters = Filters;
//# sourceMappingURL=filters.js.map