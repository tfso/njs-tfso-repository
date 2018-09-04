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
class SliceOperator extends operator_1.Operator {
    constructor(begin, end) {
        super(operator_1.OperatorType.Skip);
        this.begin = begin;
        this.end = end;
    }
    *evaluate(items) {
        let idx = -1;
        for (let item of items) {
            idx++;
            if (this.removed == false) {
                if (typeof this.begin == 'number' && idx < this.begin)
                    continue;
                if (typeof this.end == 'number' && idx >= this.end)
                    continue;
            }
            yield item;
        }
    }
    evaluateAsync(items) {
        return __asyncGenerator(this, arguments, function* evaluateAsync_1() {
            var e_1, _a;
            let idx = 0;
            try {
                for (var items_1 = __asyncValues(items), items_1_1; items_1_1 = yield __await(items_1.next()), !items_1_1.done;) {
                    let item = items_1_1.value;
                    idx++;
                    if (this.removed == false) {
                        if (typeof this.begin == 'number' && idx < this.begin)
                            continue;
                        if (typeof this.end == 'number' && idx >= this.end)
                            continue;
                    }
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
}
exports.SliceOperator = SliceOperator;
//# sourceMappingURL=sliceoperator.js.map