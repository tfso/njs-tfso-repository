"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
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
const operator_1 = require("./operators/operator");
exports.OperatorType = operator_1.OperatorType;
const orderbyoperator_1 = require("./operators/orderbyoperator");
const skipoperator_1 = require("./operators/skipoperator");
const skipwhileoperator_1 = require("./operators/skipwhileoperator");
const takeoperator_1 = require("./operators/takeoperator");
const whereoperator_1 = require("./operators/whereoperator");
const selectoperator_1 = require("./operators/selectoperator");
const joinoperator_1 = require("./operators/joinoperator");
const sliceoperator_1 = require("./operators/sliceoperator");
const remapvisitor_1 = require("./expressions/remapvisitor");
const operations_1 = require("./operations");
class Enumerable {
    constructor(items) {
        this.items = items;
        this._name = null;
        this[Symbol.asyncIterator] = () => this.asyncIterator();
        this[Symbol.iterator] = () => this.iterator();
        this._operations = new operations_1.Operations();
        this.from(items);
    }
    get name() {
        if (this._name != null)
            return this._name;
        if (this.items)
            return this.items.constructor.name;
        return "";
    }
    get operations() {
        return this._operations;
    }
    remap(remapper) {
        let visitor = remapper.length == 2 ? new remapvisitor_1.RemapVisitor(null, remapper) : new remapvisitor_1.RemapVisitor(remapper, null);
        for (let item of this._operations.values()) {
            switch (item.type) {
                case operator_1.OperatorType.Where:
                    item.expression = visitor.visit(item.expression);
                    break;
            }
        }
        return this;
    }
    where() {
        let predicate = arguments[0], parameters = [];
        if (arguments.length >= 2)
            parameters = Array.from(arguments).slice(1);
        switch (typeof predicate) {
            case 'string':
                this._operations.add(new whereoperator_1.WhereOperator('OData', predicate));
                break;
            case 'function':
                this._operations.add(new whereoperator_1.WhereOperator('Javascript', predicate, ...parameters));
                break;
            default:
                throw new Error('Where operator can not recognize predicate either as javascript or odata');
        }
        return this;
    }
    /**
    * returns a new IEnumerable of TResult
    * @param selector
    */
    select(selector) {
        if (typeof this.items == 'object' && typeof this.items[Symbol.asyncIterator] == 'function') {
            return new Enumerable(new selectoperator_1.SelectOperator(selector).evaluateAsync(this));
        }
        else {
            return new Enumerable(new selectoperator_1.SelectOperator(selector).evaluate(this));
        }
    }
    groupJoin(inner, outerKey, innerKey, selector, indexing = false) {
        let iterable = ((scope) => ({
            [Symbol.asyncIterator]: (options) => {
                return inner[Symbol.asyncIterator](Object.assign({ parent: scope }, options));
            },
            [Symbol.iterator]: (options) => {
                return inner[Symbol.iterator](Object.assign({ parent: scope }, options));
            }
        }))(this);
        if (typeof inner == 'object' && typeof inner[Symbol.asyncIterator] == 'function') {
            return new Enumerable(new joinoperator_1.JoinOperator(joinoperator_1.JoinType.Left, outerKey, innerKey, selector, indexing).evaluateAsync(this, iterable));
        }
        else {
            return new Enumerable(new joinoperator_1.JoinOperator(joinoperator_1.JoinType.Left, outerKey, innerKey, selector, indexing).evaluate(this, iterable));
        }
    }
    join(inner, outerKey, innerKey, selector, indexing = false) {
        let iterable = ((scope) => ({
            [Symbol.asyncIterator]: (options) => {
                return inner[Symbol.asyncIterator](Object.assign({ parent: scope }, options));
            },
            [Symbol.iterator]: (options) => {
                return inner[Symbol.iterator](Object.assign({ parent: scope }, options));
            }
        }))(this);
        if (typeof inner == 'object' && typeof inner[Symbol.asyncIterator] == 'function') {
            return new Enumerable(new joinoperator_1.JoinOperator(joinoperator_1.JoinType.Inner, outerKey, innerKey, selector, indexing).evaluateAsync(this, iterable));
        }
        else {
            return new Enumerable(new joinoperator_1.JoinOperator(joinoperator_1.JoinType.Inner, outerKey, innerKey, selector, indexing).evaluate(this, iterable));
        }
    }
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return
     */
    take(count) {
        this._operations.add(new takeoperator_1.TakeOperator(count));
        return this;
    }
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements
     * @param count The number of elements to skip before returning the remaining elements
     */
    skip(count) {
        this._operations.add(new skipoperator_1.SkipOperator(count));
        return this;
    }
    skipWhile() {
        let predicate = arguments[0], parameters = [];
        if (arguments.length >= 2)
            parameters = Array.from(arguments).slice(1);
        switch (typeof predicate) {
            case 'string':
                this._operations.add(new skipwhileoperator_1.SkipWhileOperator('OData', predicate));
                break;
            case 'function':
                this._operations.add(new skipwhileoperator_1.SkipWhileOperator('Javascript', predicate, ...parameters));
                break;
            default:
                throw new Error('SkipWhile operator can not recognize predicate either as javascript or odata');
        }
        return this;
    }
    orderBy(property) {
        this._operations.add(new orderbyoperator_1.OrderByOperator(property));
        return this;
    }
    slice(begin, end = undefined) {
        this._operations.add(new sliceoperator_1.SliceOperator(begin, typeof begin == 'number' ? end : undefined));
        return this;
    }
    from(items) {
        if (items) {
            if (this._name == null)
                this._name = items.constructor.name;
            this.items = items;
            if (typeof items == 'object' && typeof items[Symbol.asyncIterator] == 'function') {
                this[Symbol.iterator] = undefined; // this isn't an sync iterator, unmark it from IEnumerable
                this[Symbol.asyncIterator] = this.asyncIterator;
            }
            else if (typeof items == 'object' && typeof items[Symbol.iterator] == 'function') {
                this[Symbol.asyncIterator] = undefined; // this isn't an async iterator, unmark it from IEnumerable
                this[Symbol.iterator] = this.iterator;
            }
            else {
                throw new TypeError('Enumerable is instanced with a non-iterable object');
            }
        }
        return this;
    }
    copy() {
        let enumerable = new Enumerable(this.items);
        for (let operation of this.operations.values())
            enumerable.operations.add(operation);
        return enumerable;
    }
    first(items) {
        if (items)
            this.from(items);
        let iteratorResult = this[Symbol.iterator]().next();
        if (iteratorResult.done == false)
            return iteratorResult.value;
        return null;
    }
    async firstAsync(items) {
        if (items)
            this.from(items);
        let iteratorResult = await this[Symbol.asyncIterator]().next();
        if (iteratorResult.done == false)
            return iteratorResult.value;
        return null;
    }
    toArray(items) {
        if (items)
            this.from(items);
        let result = [];
        for (let item of this.iterator())
            result.push(item);
        return result;
    }
    async toArrayAsync(items) {
        var e_1, _a;
        if (items)
            this.from(items);
        let result = [];
        try {
            for (var _b = __asyncValues(this.asyncIterator()), _c; _c = await _b.next(), !_c.done;) {
                let item = _c.value;
                result.push(item);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    }
    static fromArray(items) {
        return new Enumerable(items);
    }
    *iterator(options) {
        if (!options || options.query == null)
            options = Object.assign(options || {}, { query: this });
        let handleItems = function* (items, operators, idx = null) {
            if (idx == null)
                idx = operators.length - 1;
            switch (idx) {
                case -1:
                    yield* items;
                    break;
                case 0:
                    yield* operators[idx].evaluate(items);
                    break;
                default:
                    yield* operators[idx].evaluate(handleItems(items, operators, idx - 1));
                    break;
            }
        };
        yield* handleItems(this.items[Symbol.iterator](options), Array.from(this.operations.values()));
    }
    asyncIterator(options) {
        return __asyncGenerator(this, arguments, function* asyncIterator_1() {
            if (!options || options.query == null)
                options = Object.assign(options || {}, { query: this });
            let handleItems = function (items, operators, idx = null) {
                return __asyncGenerator(this, arguments, function* () {
                    var e_2, _a;
                    if (idx == null)
                        idx = operators.length - 1;
                    switch (idx) {
                        case -1:
                            try {
                                for (var items_1 = __asyncValues(items), items_1_1; items_1_1 = yield __await(items_1.next()), !items_1_1.done;) {
                                    let item = items_1_1.value;
                                    yield yield __await(item);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (items_1_1 && !items_1_1.done && (_a = items_1.return)) yield __await(_a.call(items_1));
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            break;
                        case 0:
                            yield __await(yield* __asyncDelegator(__asyncValues(operators[idx].evaluateAsync(items))));
                            break;
                        default:
                            yield __await(yield* __asyncDelegator(__asyncValues(operators[idx].evaluateAsync(handleItems(items, operators, idx - 1)))));
                            break;
                    }
                });
            };
            yield __await(yield* __asyncDelegator(__asyncValues(handleItems(this.items[Symbol.asyncIterator](options), Array.from(this.operations.values())))));
        });
    }
}
exports.Enumerable = Enumerable;
exports.default = Enumerable;
//# sourceMappingURL=enumerable.js.map