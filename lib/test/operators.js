"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
            it("it should be able to iterate", () => __awaiter(this, void 0, void 0, function* () {
                let result = [];
                for (let item of new skipoperator_1.SkipOperator(5).evaluate(cars)) {
                    result.push(item);
                }
                assert.equal(result.length, 3);
            }));
            it("it should be able to iterate when it is removed", () => __awaiter(this, void 0, void 0, function* () {
                let skip = new skipoperator_1.SkipOperator(5), result = [];
                skip.remove();
                try {
                    for (var _a = __asyncValues(skip.evaluate(cars)), _b; _b = yield _a.next(), !_b.done;) {
                        let item = yield _b.value;
                        result.push(item);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) yield _c.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                assert.equal(result.length, 8);
                var e_1, _c;
            }));
        });
    });
    describe("for asyncIterable", () => {
        let cars; //: () => AsyncIterableIterator<ICar>;
        beforeEach(() => {
            let delay = (delay) => new Promise(resolve => setTimeout(resolve, delay));
            cars = function () {
                return __asyncGenerator(this, arguments, function* () {
                    yield { id: 1, location: 'SKIEN', registrationYear: 2016, type: { make: 'SAAB', model: '9-3' } };
                    yield { id: 2, location: 'PORSGRUNN', registrationYear: 2010, optional: 'yes', type: { make: 'NISSAN', model: 'QASHQAI' } };
                    yield __await(delay(10));
                    yield { id: 3, location: 'PORSGRUNN', registrationYear: 2005, type: { make: 'SAAB', model: '9-3' } };
                    yield { id: 4, location: 'LANGESUND', registrationYear: 2004, optional: 'yes', type: { make: 'NISSAN', model: 'LEAF' } };
                    yield Promise.resolve({ id: 5, location: 'BREVIK', registrationYear: 2009, optional: 'yes', type: { make: 'TOYOTA', model: 'COROLLA' } });
                    yield { id: 6, location: 'BREVIK', registrationYear: 2014, optional: 'yes', type: { make: 'HONDA', model: 'HRV' } };
                    yield Promise.resolve({ id: 7, location: 'HEISTAD', registrationYear: 2013, type: { make: 'TOYOTA', model: 'YARIS' } });
                    yield { id: 8, location: 'LARVIK', registrationYear: 2009, type: { make: 'HONDA', model: 'CIVIC' } };
                });
            };
        });
        describe("Skip", () => {
            it("it should be able to iterate", () => __awaiter(this, void 0, void 0, function* () {
                let result = [];
                try {
                    for (var _a = __asyncValues(new skipoperator_1.SkipOperator(5).evaluateAsync(cars())), _b; _b = yield _a.next(), !_b.done;) {
                        let item = yield _b.value;
                        result.push(item);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) yield _c.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                assert.equal(result.length, 3);
                var e_2, _c;
            }));
            it("it should be able to iterate when it is removed", () => __awaiter(this, void 0, void 0, function* () {
                let skip = new skipoperator_1.SkipOperator(5), result = [];
                skip.remove();
                try {
                    for (var _a = __asyncValues(skip.evaluateAsync(cars())), _b; _b = yield _a.next(), !_b.done;) {
                        let item = yield _b.value;
                        result.push(item);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) yield _c.call(_a);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                assert.equal(result.length, 8);
                var e_3, _c;
            }));
        });
    });
});
//# sourceMappingURL=operators.js.map