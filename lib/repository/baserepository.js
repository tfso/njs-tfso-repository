"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
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
const filtercriteria_1 = require("./filters/filtercriteria");
const enumerable_1 = require("./../linq/enumerable");
const whereoperator_1 = require("./../linq/operators/whereoperator");
class BaseRepository {
    constructor() {
        this[Symbol.asyncIterator] = (options) => {
            return this.asyncIterator(options, null);
        };
    }
    beginTransaction() {
        return Promise.resolve();
    }
    commitTransaction() {
        return Promise.resolve();
    }
    rollbackTransaction() {
        return Promise.resolve();
    }
    isQueryPageable(query) {
        let where = query.operations.first(whereoperator_1.WhereOperator);
        if (where)
            return where.getExpressionCount() == where.getExpressionIntersection().length;
        return true;
    }
    getCriteria() {
        if (arguments[0] instanceof enumerable_1.default) {
            for (let operator of arguments[0].operations.values())
                if (operator instanceof whereoperator_1.WhereOperator)
                    return operator.getExpressionIntersection().map(expr => new filtercriteria_1.FilterCriteria(expr));
        }
        if (Array.isArray(arguments[0]))
            return arguments[0].map(expr => new filtercriteria_1.FilterCriteria(expr));
        return [];
    }
    asyncIterator(options, meta) {
        return __asyncGenerator(this, arguments, function* asyncIterator_1() {
            if (!options)
                options = {};
            yield __await(yield* __asyncDelegator(__asyncValues(yield __await(this.readAll(options.query || null, meta, { query: options['parent'], keyProperty: options['keyProperty'], keys: options['keys'] })))));
        });
    }
    getIterable(meta) {
        let iterable = {
            [Symbol.asyncIterator]: (options) => {
                return this.asyncIterator(options, meta);
            }
        };
        iterable.constructor = this.constructor;
        return iterable;
    }
}
exports.default = BaseRepository;
//# sourceMappingURL=baserepository.js.map