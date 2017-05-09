"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter_1 = require("./filter");
const expression_1 = require("./../../linq/expressions/expression");
class Filters {
    constructor(expression) {
        this._groups = [];
        if (expression != null && expression.type == expression_1.ExpressionType.Logical)
            this._groups = filter_1.Filter.visit(expression);
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