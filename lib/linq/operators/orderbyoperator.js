"use strict";
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const operator_1 = require("./operator");
const expressionvisitor_1 = require("./../expressions/expressionvisitor");
class OrderByOperator extends operator_1.Operator {
    constructor(property) {
        super(operator_1.OperatorType.OrderBy);
        this.property = property;
        this._expression = new expressionvisitor_1.ExpressionVisitor().visitLambda(property);
    }
    *evaluate(items) {
        if (this._expression.type != expressionvisitor_1.ExpressionType.Member)
            throw new TypeError('Order by is expecting a member property as sorting property');
        var memberProperty = this._expression.property, property;
        if (memberProperty.type != expressionvisitor_1.ExpressionType.Identifier)
            throw new TypeError('Order by is expecting a member property as sorting property');
        property = memberProperty;
        let ar = Array.from(items);
        ar.sort((a, b) => {
            return a[property.name] == b[property.name] ? 0 : a[property.name] < b[property.name] ? -1 : 1;
        });
        yield* ar;
    }
    evaluateAsync(items) {
        return __asyncGenerator(this, arguments, function* evaluateAsync_1() {
            if (this._expression.type != expressionvisitor_1.ExpressionType.Member)
                throw new TypeError('Order by is expecting a member property as sorting property');
            var memberProperty = this._expression.property, property;
            if (memberProperty.type != expressionvisitor_1.ExpressionType.Identifier)
                throw new TypeError('Order by is expecting a member property as sorting property');
            property = memberProperty;
            let ar = [];
            try {
                for (var items_1 = __asyncValues(items), items_1_1; items_1_1 = yield __await(items_1.next()), !items_1_1.done;) {
                    let item = yield __await(items_1_1.value);
                    ar.push(item);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (items_1_1 && !items_1_1.done && (_a = items_1.return)) yield __await(_a.call(items_1));
                }
                finally { if (e_1) throw e_1.error; }
            }
            ar.sort((a, b) => {
                return a[property.name] == b[property.name] ? 0 : a[property.name] < b[property.name] ? -1 : 1;
            });
            yield __await(yield* __asyncDelegator(__asyncValues(ar)));
            var e_1, _a;
        });
    }
}
exports.OrderByOperator = OrderByOperator;
//# sourceMappingURL=orderbyoperator.js.map