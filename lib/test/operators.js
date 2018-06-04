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
const assert = require("assert");
const skipoperator_1 = require("./../linq/operators/skipoperator");
Symbol.asyncIterator = Symbol.asyncIterator || "__@@asyncIterator__";
describe("When using Operator", () => {
    describe("for iterable", () => {
        let cars;
        beforeEach(() => {
            cars = [
                { id: 1, location: 'SKIEN', registrationYear: 2016, type: { make: 'SAAB', model: '9-3' } },
                { id: 2, location: 'PORSGRUNN', registrationYear: 2010, optional: 'yes', type: { make: 'NISSAN', model: 'QASHQAI' } },
                { id: 3, location: 'PORSGRUNN', registrationYear: 2005, type: { make: 'SAAB', model: '9-3' } },
                { id: 4, location: 'LANGESUND', registrationYear: 2004, optional: 'yes', type: { make: 'NISSAN', model: 'LEAF' } },
                { id: 5, location: 'BREVIK', registrationYear: 2009, optional: 'yes', type: { make: 'TOYOTA', model: 'COROLLA' } },
                { id: 6, location: 'BREVIK', registrationYear: 2014, optional: 'yes', type: { make: 'HONDA', model: 'HRV' } },
                { id: 7, location: 'HEISTAD', registrationYear: 2013, type: { make: 'TOYOTA', model: 'YARIS' } },
                { id: 8, location: 'LARVIK', registrationYear: 2009, type: { make: 'HONDA', model: 'CIVIC' } }
            ];
        });
        describe("Skip", () => {
            it("it should be able to iterate", async () => {
                let result = [];
                for (let item of new skipoperator_1.SkipOperator(5).evaluate(cars)) {
                    result.push(item);
                }
                assert.equal(result.length, 3);
            });
            it("it should be able to iterate when it is removed", async () => {
                var e_1, _a;
                let skip = new skipoperator_1.SkipOperator(5), result = [];
                skip.remove();
                try {
                    for (var _b = __asyncValues(skip.evaluate(cars)), _c; _c = await _b.next(), !_c.done;) {
                        let item = await _c.value;
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
                assert.equal(result.length, 8);
            });
        });
    });
    describe("for asyncIterable", () => {
        let cars; //: () => AsyncIterableIterator<ICar>;
        beforeEach(() => {
            let delay = (delay) => new Promise(resolve => setTimeout(resolve, delay));
            cars = function () {
                return __asyncGenerator(this, arguments, function* () {
                    yield yield __await({ id: 1, location: 'SKIEN', registrationYear: 2016, type: { make: 'SAAB', model: '9-3' } });
                    yield yield __await({ id: 2, location: 'PORSGRUNN', registrationYear: 2010, optional: 'yes', type: { make: 'NISSAN', model: 'QASHQAI' } });
                    yield __await(delay(10));
                    yield yield __await({ id: 3, location: 'PORSGRUNN', registrationYear: 2005, type: { make: 'SAAB', model: '9-3' } });
                    yield yield __await({ id: 4, location: 'LANGESUND', registrationYear: 2004, optional: 'yes', type: { make: 'NISSAN', model: 'LEAF' } });
                    yield yield __await(Promise.resolve({ id: 5, location: 'BREVIK', registrationYear: 2009, optional: 'yes', type: { make: 'TOYOTA', model: 'COROLLA' } }));
                    yield yield __await({ id: 6, location: 'BREVIK', registrationYear: 2014, optional: 'yes', type: { make: 'HONDA', model: 'HRV' } });
                    yield yield __await(Promise.resolve({ id: 7, location: 'HEISTAD', registrationYear: 2013, type: { make: 'TOYOTA', model: 'YARIS' } }));
                    yield yield __await({ id: 8, location: 'LARVIK', registrationYear: 2009, type: { make: 'HONDA', model: 'CIVIC' } });
                });
            };
        });
        describe("Skip", () => {
            it("it should be able to iterate", async () => {
                var e_2, _a;
                let result = [];
                try {
                    for (var _b = __asyncValues(new skipoperator_1.SkipOperator(5).evaluateAsync(cars())), _c; _c = await _b.next(), !_c.done;) {
                        let item = await _c.value;
                        result.push(item);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                assert.equal(result.length, 3);
            });
            it("it should be able to iterate when it is removed", async () => {
                var e_3, _a;
                let skip = new skipoperator_1.SkipOperator(5), result = [];
                skip.remove();
                try {
                    for (var _b = __asyncValues(skip.evaluateAsync(cars())), _c; _c = await _b.next(), !_c.done;) {
                        let item = await _c.value;
                        result.push(item);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                assert.equal(result.length, 8);
            });
        });
    });
});
//# sourceMappingURL=operators.js.map