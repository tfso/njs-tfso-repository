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
const assert = require("assert");
const baserepository_1 = require("./../repository/baserepository");
const enumerable_1 = require("./../linq/enumerable");
const takeoperator_1 = require("./../linq/operators/takeoperator");
class CarRepository extends baserepository_1.default {
    read(id) {
        return new enumerable_1.default(this).where((it, id) => it.id == id, id).firstAsync();
    }
    readAll(query, meta) {
        let specialcar, cars = [
            { id: 1, location: 'SKIEN', registrationYear: 2016, type: { make: 'SAAB', model: '9-3' } },
            { id: 2, location: 'PORSGRUNN', registrationYear: 2010, type: { make: 'NISSAN', model: 'QASHQAI' } },
            { id: 3, location: 'PORSGRUNN', registrationYear: 2005, type: { make: 'SAAB', model: '9-3' } },
            { id: 4, location: 'LANGESUND', registrationYear: 2004, type: { make: 'NISSAN', model: 'LEAF' } },
            { id: 5, location: 'BREVIK', registrationYear: 2009, type: { make: 'TOYOTA', model: 'COROLLA' } },
            { id: 6, location: 'BREVIK', registrationYear: 2014, type: { make: 'HONDA', model: 'HRV' } },
            specialcar = { id: 7, location: 'HEISTAD', registrationYear: 2013, type: { make: 'TOYOTA', model: 'YARIS' } },
            { id: 8, location: 'LARVIK', registrationYear: 2009, type: { make: 'HONDA', model: 'CIVIC' } }
        ];
        for (let criteria of this.getCriteria(query)) {
            switch (criteria.property) {
                case 'id':
                    if (criteria.operator == '==' && criteria.value == 7) {
                        if (meta) {
                            meta.totalLength = 1;
                        }
                        return Promise.resolve([specialcar]); // optimized
                    }
                    break;
            }
        }
        let skip = query.operations.first(enumerable_1.OperatorType.Skip);
        if (skip) {
            query.operations.remove(skip); // removing it as we are doing this part at database level instead
        }
        let take = query.operations.first(enumerable_1.OperatorType.Take);
        if (take) {
            query.operations.remove(take); // removing it as we are doing this part at database level instead
        }
        else {
            take = new takeoperator_1.TakeOperator(5); // if left out, take 5 to default to paging
        }
        let where = query.operations.first(enumerable_1.OperatorType.Where);
        if (where)
            cars = cars.filter(where.predicate);
        if (meta)
            meta.totalLength = cars.length; // total cars for current filter
        if (skip)
            cars = cars.slice(skip.count); // simulating paging at database level
        if (take)
            cars = cars.slice(0, take.count); // simulating paging at database level
        if (meta)
            meta.length = cars.length; // length after paging
        if (meta && take) {
            if ((cars.length + (skip ? skip.count : 0)) < meta.totalLength)
                meta.continuationToken = `${cars.length + (skip ? skip.count : 0)}:${meta.totalLength}`;
            else
                meta.continuationToken = null;
        }
        return Promise.resolve(cars); // unoptimized
    }
    query(query, meta) {
        return __asyncGenerator(this, arguments, function* query_1() {
            if (!meta)
                meta = {};
            let skip = 0;
            while (true) {
                let cars = yield __await(this.readAll(query.skip(skip).take(2), meta));
                yield __await(yield* __asyncDelegator(__asyncValues(cars))
                // two ways, depends how readAll is implemented 
                );
                // two ways, depends how readAll is implemented 
                if (meta.continuationToken == null || (skip + cars.length >= meta.totalLength))
                    break;
                skip += cars.length;
            }
        });
    }
    async create(car) {
        throw new Error('Not implemented');
    }
    async update(car) {
        throw new Error('Not implemented');
    }
    async delete(car) {
        throw new Error('Not implemented');
    }
    exposeIfQueryIsPageable(query) {
        return super.isQueryPageable(query);
    }
    exposeCriteriaCount(query) {
        return super.getCriteria(query).length;
    }
}
class LocationRepository extends baserepository_1.default {
    read(id) {
        return new enumerable_1.default(this).where((it, id) => it.location == id, id).firstAsync();
    }
    readAll(query, meta, parent) {
        let locations = [
            { location: 'SKIEN', zipcode: 3955, ziparea: 'Skien' },
            { location: 'PORSGRUNN', zipcode: 3949, ziparea: 'Porsgrunn' },
            { location: 'LANGESUND', zipcode: 3970, ziparea: 'Langesund' },
            { location: 'HEISTAD', zipcode: 3943, ziparea: 'Porsgrunn' },
            { location: 'BREVIK', zipcode: 3940, ziparea: 'Porsgrunn' }
        ];
        return Promise.resolve(locations);
    }
    async create(car) {
        throw new Error('Not implemented');
    }
    async update(car) {
        throw new Error('Not implemented');
    }
    async delete(car) {
        throw new Error('Not implemented');
    }
}
describe("When using Repository", () => {
    beforeEach(() => {
    });
    it("should work with query", async () => {
        let ar = await new enumerable_1.default(new CarRepository()).toArrayAsync();
        assert.equal(ar.length, 8);
    });
    it("should work with joins", async () => {
        let meta = {}, ar = new enumerable_1.default(new CarRepository().getIterable(meta))
            .where(it => it.id == 7)
            .take(5)
            .join(new LocationRepository(), a => a.location, b => b.location, (a, b) => Object.assign({}, a), true);
        let t = await ar.toArrayAsync();
        assert.equal(t.length, 1);
        assert.equal(meta.totalLength, 1);
    });
    it("should work with optimized query", async () => {
        let repo = new CarRepository(), cars = await new enumerable_1.default(repo).where(it => it.id == 7).toArrayAsync();
        assert.ok(repo instanceof baserepository_1.default);
        assert.equal(cars.length, 1);
        assert.equal(cars[0].id, 7);
    });
    it("should work with random query", async () => {
        let repo = new CarRepository(), cars = await new enumerable_1.default(repo).where(it => it.id == 6).toArrayAsync();
        assert.ok(repo instanceof baserepository_1.default);
        assert.equal(cars.length, 1);
        assert.equal(cars[0].id, 6);
    });
    it("should work with random query using input param", async () => {
        let repo = new CarRepository(), cars = await new enumerable_1.default(repo).where((it, id) => it.id == id, 6).toArrayAsync();
        assert.ok(repo instanceof baserepository_1.default);
        assert.equal(cars.length, 1);
        assert.equal(cars[0].id, 6);
    });
    it("should be able to remove paging operations for manual handling", async () => {
        let repo = new CarRepository(), cars;
        cars = await new enumerable_1.default(repo)
            .where(it => it.registrationYear >= 2005)
            .skip(5)
            .take(3)
            .toArrayAsync();
        assert.equal(cars.length, 2);
        assert.equal(cars[0].id, 7);
    });
    it("should be able to see that a query can't be pageable after plucking union expressions", async () => {
        let repo = new CarRepository(), query = new enumerable_1.default(repo).where(it => (it.registrationYear == 2017 || it.location == 'NO') && it.id >= 7);
        assert.equal(repo.exposeIfQueryIsPageable(query), false);
    });
    it("should be able to see that a query can be pageable after plucking union expressions", async () => {
        let repo = new CarRepository(), query = new enumerable_1.default(repo).where(it => it.location == 'NO' && it.registrationYear >= 2000);
        assert.equal(repo.exposeCriteriaCount(query), 2);
        assert.equal(repo.exposeIfQueryIsPageable(query), true);
    });
    it("should be able to see that a query can be pageable after plucking union expressions that is common", async () => {
        let repo = new CarRepository(), query = new enumerable_1.default(repo).where(it => (it.location == 'NO') || (it.registrationYear >= 2000 && it.location == 'NO'));
        assert.equal(repo.exposeCriteriaCount(query), 1);
        assert.equal(repo.exposeIfQueryIsPageable(query), false);
    });
});
//# sourceMappingURL=repository.js.map