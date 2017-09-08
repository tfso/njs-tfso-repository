"use strict";
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
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
const enumerable_1 = require("./../enumerable");
const operator_1 = require("./operator");
const expressionvisitor_1 = require("./../expressions/expressionvisitor");
var JoinType;
(function (JoinType) {
    JoinType[JoinType["Inner"] = 0] = "Inner";
    JoinType[JoinType["Left"] = 1] = "Left";
})(JoinType = exports.JoinType || (exports.JoinType = {}));
class JoinOperator extends operator_1.Operator {
    constructor(joinType, outerKey, innerKey, selector, indexing = false) {
        super(operator_1.OperatorType.Join);
        this.joinType = joinType;
        this.selector = selector;
        this.indexing = indexing;
        this.outerProperty = new expressionvisitor_1.ExpressionVisitor().visitLambda(outerKey);
        this.innerProperty = new expressionvisitor_1.ExpressionVisitor().visitLambda(innerKey);
    }
    getPropertyName(expr) {
        if (expr.type == expressionvisitor_1.ExpressionType.Member && expr.property.type == expressionvisitor_1.ExpressionType.Identifier)
            return expr.property.name;
        return undefined;
    }
    getOuterKey(outerItem) {
        let propertyName;
        if ((propertyName = this.getPropertyName(this.outerProperty)))
            return outerItem[propertyName];
        return null;
    }
    getInnerKey(innerItem) {
        let propertyName;
        if ((propertyName = this.getPropertyName(this.innerProperty)))
            return innerItem[propertyName];
        return null;
    }
    *evaluate(outer, inner) {
        let keyvalues = new Map(), outerAr = [], outerKeys = [];
        if (this.indexing === true) {
            for (let a of outer) {
                outerAr.push(a);
                outerKeys.push(this.getOuterKey(a));
            }
            outer = outerAr;
        }
        // only able to iterate through once, but build up a Map of <innerKey, TInner[]> to make join match fast 
        for (let b of inner[Symbol.iterator].call(inner, { keyProperty: this.getPropertyName(this.innerProperty), keys: outerKeys })) {
            let key, values;
            if ((values = keyvalues.get(key = this.getInnerKey(b))) == null)
                keyvalues.set(key, values = []);
            values.push(b);
        }
        for (let a of outer) {
            let values;
            switch (this.joinType) {
                case JoinType.Inner:
                    if (values = keyvalues.get(this.getOuterKey(a)))
                        yield this.selector(a, new enumerable_1.default(values));
                    break;
                case JoinType.Left:
                    if ((values = keyvalues.get(this.getOuterKey(a))) == null)
                        values = [];
                    yield this.selector(a, new enumerable_1.default(values));
                    break;
            }
        }
        keyvalues.clear();
    }
    evaluateAsync(outer, inner) {
        return __asyncGenerator(this, arguments, function* evaluateAsync_1() {
            let keyvalues = new Map(), outerAr = [], outerKeys = [];
            if (this.indexing === true) {
                try {
                    for (var outer_1 = __asyncValues(outer), outer_1_1; outer_1_1 = yield __await(outer_1.next()), !outer_1_1.done;) {
                        let a = yield __await(outer_1_1.value);
                        outerAr.push(a);
                        outerKeys.push(this.getOuterKey(a));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (outer_1_1 && !outer_1_1.done && (_a = outer_1.return)) yield __await(_a.call(outer_1));
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                outer = outerAr;
            }
            try {
                for (var _b = __asyncValues(inner[Symbol.asyncIterator].call(inner, { keyProperty: this.getPropertyName(this.innerProperty), keys: outerKeys })), _c; _c = yield __await(_b.next()), !_c.done;) {
                    let b = yield __await(_c.value);
                    let key, values;
                    if ((values = keyvalues.get(key = this.getInnerKey(b))) == null)
                        keyvalues.set(key, values = []);
                    values.push(b);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_d = _b.return)) yield __await(_d.call(_b));
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                for (var outer_2 = __asyncValues(outer), outer_2_1; outer_2_1 = yield __await(outer_2.next()), !outer_2_1.done;) {
                    let a = yield __await(outer_2_1.value);
                    let values;
                    switch (this.joinType) {
                        case JoinType.Inner:
                            if (values = keyvalues.get(this.getOuterKey(a)))
                                yield this.selector(a, new enumerable_1.default(values));
                            break;
                        case JoinType.Left:
                            if ((values = keyvalues.get(this.getOuterKey(a))) == null)
                                values = [];
                            yield this.selector(a, new enumerable_1.default(values));
                            break;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (outer_2_1 && !outer_2_1.done && (_e = outer_2.return)) yield __await(_e.call(outer_2));
                }
                finally { if (e_3) throw e_3.error; }
            }
            keyvalues.clear();
            var e_1, _a, e_2, _d, e_3, _e;
        });
    }
}
exports.JoinOperator = JoinOperator;
//# sourceMappingURL=joinoperator.js.map