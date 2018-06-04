"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const operator_1 = require("./operator");
const expression_1 = require("./../expressions/expression");
const logicalexpression_1 = require("./../expressions/logicalexpression");
const unaryexpression_1 = require("../expressions/unaryexpression");
const reducervisitor_1 = require("./../expressions/reducervisitor");
const odatavisitor_1 = require("./../expressions/odatavisitor");
class WhereOperator extends operator_1.Operator {
    constructor(predicateType, predicate, ...parameters) {
        super(operator_1.OperatorType.Where);
        //this._parameters = parameters;
        switch (predicateType) {
            case 'Javascript':
                let visitor;
                this._expression = (visitor = new reducervisitor_1.ReducerVisitor()).visitLambda(predicate, ...parameters);
                this._it = visitor.it;
                this._footprint = new Object(predicate).toString();
                this._predicate = (entity) => {
                    return predicate.apply({}, [entity].concat(parameters)) === true;
                };
                //if (visitor.isSolvable == false)
                //    throw new Error('Predicate is not solvable');
                break;
            case 'OData':
                this._expression = new odatavisitor_1.ODataVisitor().visitOData(predicate);
                this._it = "";
                this._footprint = predicate;
                this._predicate = (entity) => {
                    return odatavisitor_1.ODataVisitor.evaluate(this._expression, entity) === true;
                };
                break;
        }
    }
    //public get parameters(): any[] {
    //    return this._parameters;
    //}
    get predicate() {
        return this._predicate == null ? () => true : this._predicate;
    }
    get expression() {
        return this._expression;
    }
    set expression(value) {
        this._expression = value;
    }
    *evaluate(items) {
        for (let item of items)
            if (this._predicate(item))
                yield item;
    }
    evaluateAsync(items) {
        return __asyncGenerator(this, arguments, function* evaluateAsync_1() {
            var e_1, _a;
            try {
                for (var items_1 = __asyncValues(items), items_1_1; items_1_1 = yield __await(items_1.next()), !items_1_1.done;) {
                    let item = yield yield __await(__await(items_1_1.value));
                    if (this._predicate(item))
                        yield yield __await(item);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (items_1_1 && !items_1_1.done && (_a = items_1.return)) yield __await(_a.call(items_1));
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    getExpressionIntersection() {
        let intersection;
        intersection = Array.from(this.getExpressionGroups()).reduce((acc, curr, idx) => {
            return Array.from(curr).filter((expr) => {
                return !acc || acc.some(intersect => expr.equal(intersect));
            });
        }, intersection);
        return intersection || [];
    }
    getExpressionUnion() {
        let union;
        union = Array.from(this.getExpressionGroups()).reduce((acc, curr, idx) => {
            return (acc || []).concat(Array.from(curr));
        }, union);
        return union || [];
    }
    getExpressionCount() {
        let visit = (expression) => {
            switch (expression.type) {
                case expression_1.ExpressionType.Logical:
                    switch (expression.operator) {
                        case logicalexpression_1.LogicalOperatorType.And:
                        case logicalexpression_1.LogicalOperatorType.Or:
                            return visit(expression.left) + visit(expression.right);
                        default:
                            return 1;
                    }
                default:
                    return 0;
            }
        };
        return visit(this.expression);
    }
    getExpressionGroups() {
        let it = this._it, visit = function* (expression) {
            let visitGroup = function* (child) {
                switch (child.operator) {
                    case logicalexpression_1.LogicalOperatorType.Or:
                        break;
                    case logicalexpression_1.LogicalOperatorType.And:
                        if (child.left instanceof logicalexpression_1.LogicalExpression)
                            yield* visitGroup(child.left);
                        if (child.right instanceof logicalexpression_1.LogicalExpression)
                            yield* visitGroup(child.right);
                        break;
                    default:
                        let reduceMemberToIdentifier = (expr) => {
                            switch (expr.type) {
                                case expression_1.ExpressionType.Logical:
                                    let left = reduceMemberToIdentifier(expr.left), right = reduceMemberToIdentifier(expr.right);
                                    if ((left.type == expression_1.ExpressionType.Identifier || left.type == expression_1.ExpressionType.Member || left.type == expression_1.ExpressionType.Method) == false) {
                                        switch (expr.operator) {
                                            case logicalexpression_1.LogicalOperatorType.And:
                                            case logicalexpression_1.LogicalOperatorType.Or:
                                            case logicalexpression_1.LogicalOperatorType.NotEqual:
                                            case logicalexpression_1.LogicalOperatorType.Equal:
                                                return new logicalexpression_1.LogicalExpression(expr.operator, left, right);
                                            case logicalexpression_1.LogicalOperatorType.Greater: // 5 > 2 == 2 < 5
                                                return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Lesser, right, left);
                                            case logicalexpression_1.LogicalOperatorType.GreaterOrEqual: // 5 >= 2 == 2 <= 5
                                                return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.LesserOrEqual, right, left);
                                            case logicalexpression_1.LogicalOperatorType.Lesser: // 5 < 2 == 2 > 5
                                                return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Greater, right, left);
                                            case logicalexpression_1.LogicalOperatorType.LesserOrEqual: // 5 <= 2 == 2 >= 5
                                                return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.GreaterOrEqual, right, left);
                                        }
                                    }
                                    return new logicalexpression_1.LogicalExpression(expr.operator, left, right);
                                case expression_1.ExpressionType.Member:
                                    if (expr.object.type == expression_1.ExpressionType.Identifier && expr.object.name == it)
                                        return expr.property;
                                    else
                                        return expr;
                                case expression_1.ExpressionType.Unary:
                                    switch (expr.operator) {
                                        case unaryexpression_1.UnaryOperatorType.Positive:
                                            return reduceMemberToIdentifier(expr.argument);
                                    }
                                default:
                                    return expr;
                            }
                        };
                        let reduced = reduceMemberToIdentifier(child);
                        if (reduced.type == expression_1.ExpressionType.Logical)
                            yield reduced;
                }
            };
            if (expression instanceof logicalexpression_1.LogicalExpression) {
                if (expression.operator == logicalexpression_1.LogicalOperatorType.Or) {
                    yield* visit(expression.left);
                    yield* visit(expression.right);
                }
                else {
                    yield visitGroup(expression);
                }
            }
        };
        // TODO; make a simplifier visitor that returns member expressions at left side an evaluates method call expressions (reduceMemberToIdentifier above does this now);
        return visit(this.expression);
    }
    toString() {
        return this._footprint; // should be this._expression.toString() sooner or later
    }
}
exports.WhereOperator = WhereOperator;
//# sourceMappingURL=whereoperator.js.map