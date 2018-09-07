"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
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
const filtercriteria_1 = require("./filters/filtercriteria");
const enumerable_1 = require("./../linq/enumerable");
const operator_1 = require("./../linq/operators/operator");
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
        let where = query.operations.first(operator_1.OperatorType.Where);
        if (where)
            return where.getExpressionCount() == where.getExpressionIntersection().length;
        return true;
    }
    getCriteriaGroups(query) {
        if (query instanceof enumerable_1.default) {
            for (let operator of query.operations.values())
                if (operator instanceof whereoperator_1.WhereOperator) {
                    return Array
                        .from(operator.getExpressionGroups())
                        .map(group => Array
                        .from(group)
                        .map(expr => new filtercriteria_1.FilterCriteria(expr)));
                }
        }
        return [];
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
    /**
     * Async iterable iterator that has the same signature as readAll, may be overridden to support query through pages.
     * Method is protected since it's primary used by getIterable or [Symbol.asyncIterator]
     * @param query
     * @param meta
     */
    query(query, meta, parent) {
        return __asyncGenerator(this, arguments, function* query_1() {
            yield __await(yield* __asyncDelegator(__asyncValues(yield __await(this.readAll(query, meta, parent)))));
        });
    }
    asyncIterator(options, meta) {
        return __asyncGenerator(this, arguments, function* asyncIterator_1() {
            if (!options)
                options = {};
            yield __await(yield* __asyncDelegator(__asyncValues(yield __await(this.query(options.query || null, meta, { query: options['parent'], keyProperty: options['keyProperty'], keys: options['keys'] })))));
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