"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const enumerable_1 = require("./../linq/enumerable");
const skipoperator_1 = require("./../linq/operators/skipoperator");
const whereoperator_1 = require("./../linq/operators/whereoperator");
describe("When using Enumerable", () => {
    var cars, locations;
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
        locations = [
            { location: 'SKIEN', zipcode: 3955, ziparea: 'Skien' },
            { location: 'PORSGRUNN', zipcode: 3949, ziparea: 'Porsgrunn' },
            { location: 'LANGESUND', zipcode: 3970, ziparea: 'Langesund' },
            { location: 'HEISTAD', zipcode: 3943, ziparea: 'Porsgrunn' },
            { location: 'BREVIK', zipcode: 3940, ziparea: 'Porsgrunn' }
        ];
    });
    describe("with iterable", () => {
        it("should be able to iterate", () => __awaiter(this, void 0, void 0, function* () {
            let count = 0;
            for (let item of new enumerable_1.default(cars).where(it => it.id > 0)) {
                count++;
            }
            assert.equal(count, 8);
        }));
    });
    describe("with async iterable", () => {
        let delay, list;
        beforeEach(() => {
            delay = (delay) => new Promise(resolve => setTimeout(resolve, delay));
            list = function () {
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
        it("should be able to iterate", () => __awaiter(this, void 0, void 0, function* () {
            let count = 0;
            try {
                for (var _a = __asyncValues(new enumerable_1.default(list()).where(it => it.id > 0)), _b; _b = yield _a.next(), !_b.done;) {
                    let item = yield _b.value;
                    count++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) yield _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            assert.equal(count, 8);
            var e_1, _c;
        }));
        it("should be able to handle list of items", () => __awaiter(this, void 0, void 0, function* () {
            let hasItems = false;
            try {
                for (var _d = __asyncValues(new enumerable_1.default(list()).where(it => it.id == 3)), _e; _e = yield _d.next(), !_e.done;) {
                    let item = yield _e.value;
                    hasItems = true;
                    assert.equal(item.id, 3);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_f = _d.return)) yield _f.call(_d);
                }
                finally { if (e_2) throw e_2.error; }
            }
            assert.ok(hasItems);
            var e_2, _f;
        }));
        it("should be able to handle list of promises", () => __awaiter(this, void 0, void 0, function* () {
            let hasItems = false;
            try {
                for (var _g = __asyncValues(new enumerable_1.default(list()).where(it => it.id == 5)), _h; _h = yield _g.next(), !_h.done;) {
                    let item = yield _h.value;
                    hasItems = true;
                    assert.equal(item.id, 5);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_j = _g.return)) yield _j.call(_g);
                }
                finally { if (e_3) throw e_3.error; }
            }
            assert.ok(hasItems);
            var e_3, _j;
        }));
        it("test", () => {
            let parents = function* () {
                yield { id: 1, reg: 'Dolly Duck', year: 1937 };
                yield { id: 2, reg: 'Donald', year: 1934 };
                yield { id: 3, reg: 'Skrue McDuck', year: 1947 };
            };
            let childs = function* () {
                yield { parent: 2, name: 'Ole', year: 1940 };
                yield { parent: 1, name: 'Hetti', year: 1953 };
                yield { parent: 2, name: 'Dole', year: 1940 };
                yield { parent: 2, name: 'Doffen', year: 1940 };
                yield { parent: 1, name: 'Netti', year: 1953 };
            };
            let donald = new enumerable_1.default(parents())
                .where(it => it.id == 2)
                .join(new enumerable_1.default(childs()).select(it => ({ parent: it.parent, name: it.name })), a => a.id, b => b.parent, (a, b) => Object.assign({}, a, { childs: b.toArray() }))
                .first();
            // "{"id":2,"reg":"Donald","year":1934,"childs":[{"parent":2,"name":"Ole"},{"parent":2,"name":"Dole"},{"parent":2,"name":"Doffen"}]}"
        });
    });
    describe("with joins", () => {
        it("should be able to do inner join", () => {
            let car = new enumerable_1.default(cars)
                .where(it => it.id == 2)
                .join(new enumerable_1.default(locations).select(it => ({ location: it.location, city: it.ziparea })), a => a.location, b => b.location, (a, b) => Object.assign({}, a, b.first()))
                .first();
            assert.ok(car != null);
            assert.equal(car.id, 2);
            assert.equal(car.city, 'Porsgrunn');
        });
        it("should be able to get all cars from city 'Porsgrunn'", () => {
            let cities = new enumerable_1.default(locations)
                .where(it => it.ziparea == 'Porsgrunn');
            let list = new enumerable_1.default(cars)
                .join(cities, outer => outer.location, inner => inner.location, (outer, inner) => outer)
                .toArray();
            assert.equal(list.length, 5);
        });
    });
    describe("with Lambda query", () => {
        it("should be able to do a simple query", () => {
            let query = new enumerable_1.default();
            query.where(it => it.location == 'BREVIK');
            query.skip(1);
            query.take(3);
            let result = query.toArray(cars);
            assert.equal(result.length, 1);
        });
        it("should return nothing when an usolvable query is used", () => {
            let query = new enumerable_1.default(), unknown;
            query.where(it => it.location == 'BREVIK' && unknown == true);
            let result = query.toArray(cars);
            assert.equal(result.length, 0);
        });
        it("should be able to do a simple query using one named parameters", () => {
            let query = new enumerable_1.default();
            query.where((it, loc) => it.location == loc, 'BREVIK');
            query.skip(1);
            query.take(3);
            let result = query.toArray(cars);
            assert.equal(result.length, 1);
        });
        it("should be able to do a simple query using two named parameters", () => {
            let query = new enumerable_1.default();
            query.where((it, loc, year) => it.location == loc && it.registrationYear >= year, 'BREVIK', 2010);
            let result = query.toArray(cars);
            assert.equal(result.length, 1);
        });
        it("should be able to do a simple query with a nested model", () => {
            let query = new enumerable_1.default();
            query.where(it => it.type.make == 'TOYOTA');
            let result = query.toArray(cars);
            assert.equal(result.length, 2);
        });
    });
    describe("with OData query", () => {
        it("should be able to do a simple query", () => {
            let query = new enumerable_1.default();
            query.where("location eq 'BREVIK'");
            query.skip(1);
            query.take(3);
            let result = query.toArray(cars);
            assert.equal(result.length, 1);
        });
        it("should return nothing when an usolvable query is used", () => {
            let query = new enumerable_1.default();
            query.where("location eq 'BREVIK' and unkown eq true");
            let result = query.toArray(cars);
            assert.equal(result.length, 0);
        });
        it("should be able to do a complex query", () => {
            let result = new enumerable_1.default(cars)
                .where("((id eq 7) or (location eq 'PORSGRUNN')) and registrationYear ge 2000")
                .toArray();
            assert.equal(result.length, 3);
        });
        it("should be able to do a complex query with with optional property", () => {
            let result = new enumerable_1.default(cars)
                .where("((type/make eq 'TOYOTA') or (optional eq 'yes')) and registrationYear ge 2000")
                .toArray();
            assert.equal(result.length, 5);
        });
        it("should be able to do a simple query with a nested model", () => {
            let query = new enumerable_1.default();
            query.where("type/make eq 'TOYOTA'");
            let result = query.toArray(cars);
            assert.equal(result.length, 2);
        });
        it("should be able to rename a flat model", () => {
            let query = new enumerable_1.default();
            query.where("tolower(Place) eq 'brevik'");
            query.remap((name) => {
                if (name == 'Place')
                    return 'location';
            });
            let result = query.toArray(cars);
            assert.equal(result.length, 2);
            let where = query.operations.first(whereoperator_1.WhereOperator);
        });
        it("should be able to rename a value in a flat model", () => {
            let query = new enumerable_1.default();
            query.where("tolower(location) eq 'BREVIK'");
            query.remap((name, value) => {
                if (name == 'location')
                    return value.toLowerCase();
            });
            let result = query.toArray(cars);
            assert.equal(result.length, 2);
            let where = query.operations.first(whereoperator_1.WhereOperator);
        });
        it("should be able to rename a nested model", () => {
            let query = new enumerable_1.default();
            query.where("tolower(car/make) eq 'toyota'");
            query.remap((name) => {
                if (name == 'car.make')
                    return 'type.make';
            });
            let result = query.toArray(cars);
            assert.equal(result.length, 2);
            let where = query.operations.first(whereoperator_1.WhereOperator);
        });
    });
    it("should take top 1", () => {
        var ar = new enumerable_1.default(cars).take(1).toArray();
        assert.ok(ar.length == 1);
    });
    it("should skip 0", () => {
        var ar = new enumerable_1.default(cars).skip(0).toArray();
        assert.equal(ar[0].id, 1);
        assert.equal(ar.length, 8);
    });
    it("should take MAX", () => {
        var ar = new enumerable_1.default(cars).skip(0).take(Number.MAX_VALUE).toArray();
        assert.equal(ar[0].id, 1);
        assert.equal(ar.length, 8);
    });
    it("should skip 5", () => {
        var ar = new enumerable_1.default(cars).skip(5).toArray();
        assert.ok(ar[0].id == 6);
    });
    it("should skip 5 and take 3", () => {
        var ar = new enumerable_1.default(cars).skip(5).take(3).toArray();
        assert.ok(ar.length == 3);
        assert.ok(ar[0].id == 6);
    });
    it("should order by a property", () => {
        var ar = new enumerable_1.default(cars).orderBy(it => it.location).toArray();
        assert.deepEqual(ar.map(item => item.location), ["BREVIK", "BREVIK", "HEISTAD", "LANGESUND", "LARVIK", "PORSGRUNN", "PORSGRUNN", "SKIEN"]);
    });
    it("should be able to get first element", () => {
        var el = new enumerable_1.default(cars).orderBy(it => it.location).first();
        assert.equal(el.id, 5);
    });
    it("should be able to iterate", () => {
        var enumerable = new enumerable_1.default(cars).take(3), ar = Array.from(enumerable);
        assert.equal(ar.length, 3);
    });
    it("should just work", () => {
        let query = new enumerable_1.default();
        query.skip(5);
        query.take(3);
        var ar = query.toArray(cars);
        assert.ok(ar.length == 3);
        assert.ok(ar[0].id == 6);
    });
    it("should iterate through operations", () => {
        let query = new enumerable_1.default();
        query.skip(5);
        query.take(3);
        var operations = query.operations.values();
        var count = 0;
        for (let operator of operations) {
            if (operator) {
                count++;
            }
        }
        assert.equal(count, 2);
    });
    it("should be able to convert list by using select", () => {
        let car = new enumerable_1.default(cars)
            .where(it => it.id == 2)
            .select(it => ({ id: it.id, make: it.type.make, model: it.type.model }))
            .first();
        assert.equal(car.id, 2);
        assert.equal(car.make, 'NISSAN');
        assert.equal(car.model, 'QASHQAI');
    });
    it("should be able to get first Operator by class", () => {
        let query = new enumerable_1.default();
        query.where(it => it.location == 'BREVIK');
        query.skip(5);
        query.take(3);
        query.skip(1);
        query.take(1);
        let op = query.operations.first(skipoperator_1.SkipOperator);
        assert.notEqual(op, null);
        assert.equal(op.type, enumerable_1.OperatorType.Skip);
        assert.equal(op.count, 5);
    });
    it("should be able to get first Operator by type", () => {
        let query = new enumerable_1.default();
        query.where(it => it.location == 'BREVIK');
        query.skip(5);
        query.take(3);
        query.skip(1);
        query.take(1);
        let op = query.operations.first(enumerable_1.OperatorType.Skip);
        assert.notEqual(op, null);
        assert.equal(op.type, enumerable_1.OperatorType.Skip);
        assert.equal(op.count, 5);
    });
    it("should be able to get first Operator by class and remove it for manual operator handling", () => {
        let query = new enumerable_1.default(cars), skip, skipCount;
        query.where(it => it.registrationYear >= 2000);
        query.take(8);
        query.skip(6);
        query.take(3);
        query.skip(1);
        assert.equal(Array.from(query.operations.values()).length, 5);
        skip = query.operations.first(skipoperator_1.SkipOperator);
        assert.notEqual(skip, null);
        assert.equal(skip.type, enumerable_1.OperatorType.Skip);
        assert.equal(skip.count, 6);
        query.operations.remove(skip);
        skip = query.operations.first(skipoperator_1.SkipOperator);
        assert.notEqual(skip, null);
        assert.equal(skip.type, enumerable_1.OperatorType.Skip);
        assert.equal(skip.count, 1);
        assert.equal(Array.from(query.operations.values()).length, 4);
        let mycars = query.toArray();
        assert.equal(mycars.length, 2);
    });
});
//# sourceMappingURL=enumerable.js.map