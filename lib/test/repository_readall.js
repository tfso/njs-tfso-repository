"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const baserepository_1 = require("./../repository/baserepository");
const enumerable_1 = require("./../linq/enumerable");
describe("When using repository to read all", () => {
    var repository;
    beforeEach(() => {
        repository = new CarRepository();
    });
    it("should handle non existing where", () => {
        var list = repository.exposeFilters(new enumerable_1.default().skip(5).take(3));
        assert.ok(list != null, "expected filters");
        assert.ok(list.length == 0, "Expected 0 filter");
    });
    it("should handle multiple or/and expressions", () => {
        var list = repository.exposeFilters(new enumerable_1.default().where((car) => car.registrationYear >= 2016 || car.location == 'NO' && car.registrationYear > 2000 && car.id != null && (car.registrationYear > 2000 || car.registrationYear == 1999)));
        assert.ok(list.length == 0, "Expected non common filters");
    });
    it("should return a single filter", () => {
        var list = repository.exposeFilters(new enumerable_1.default().where((car) => car.location == 'PORSGRUNN'));
        assert.ok(list.length == 1, "Expected one criteria");
    });
    it("should return a single filter with two criteria", () => {
        var list = repository.exposeFilters(new enumerable_1.default().where((car) => car.registrationYear > 2015 && car.location == 'PORSGRUNN'));
        assert.ok(list.length == 2, "Expected two criteria");
    });
    it("should return a criteria using property to be equal value", () => {
        var list = repository.exposeFilters(new enumerable_1.default().where((car) => car.location == 'NO'));
        assert.ok(list.length == 1, "Expected a single criteria");
        assert.ok(list[0].property == "location", "Expected property to be 'location'");
        assert.ok(list[0].value == "NO", "Expected value to be 'NO'");
    });
    it("should return a criteria using property to be greater than value", () => {
        var list = repository.exposeFilters(new enumerable_1.default().where((car) => car.registrationYear > 2000));
        assert.ok(list.length == 1, "Expected a single criteria");
        assert.ok(list[0].property == "registrationYear", "Expected property to be 'registrationYear'");
        assert.ok(list[0].value == 2000, "Expected value to be 2000");
        assert.ok(list[0].operator == ">", "Expected operator to be greater than");
    });
    it("should return a criteria using property to be greater than value just the other way around", () => {
        var list = repository.exposeFilters(new enumerable_1.default().where((car) => 2000 < car.registrationYear));
        assert.ok(list.length == 1, "Expected a single criteria");
        assert.ok(list[0].property == "registrationYear", "Expected property to be 'registrationYear'");
        assert.ok(list[0].value == 2000, "Expected value to be 2000");
        assert.ok(list[0].operator == ">", "Expected operator to be greater than");
    });
    //it("should cast an exception if a unsolvable expression is used", () => {
    //    assert.throws(
    //        () => {
    //            repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => this.unknown == 5));
    //        },
    //        Error
    //    );
    //})
    it("should intersection filter properties that is common ", () => {
        var intersection = repository.exposeFilters(new enumerable_1.default().where((car) => (car.registrationYear == 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)));
        assert.ok(intersection.length == 1, "Expected one criteria from intersection");
        assert.ok(intersection[0].property == "registrationYear", "Expected property to be 'registrationYear'");
    });
    it("should intersection filter properties that is not common", () => {
        var intersection = repository.exposeFilters(new enumerable_1.default().where((car) => (car.registrationYear > 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)));
        assert.ok(intersection.length == 0, "Expected zero criteria from intersection");
    });
    it("should handle method calls", () => {
        var list = repository.exposeFilters(new enumerable_1.default().where((car) => car.location.toLowerCase() == "no"));
        if (Date.now() < new Date(2018, 9, 1).getTime())
            return;
        assert.ok(false);
        //assert.ok(list.length == 1, "Expected a single criteria");
        //assert.ok(list[0].method == "toLowerCase");
    });
    it("should handle some unary expressions", () => {
        var list = repository.exposeFilters(new enumerable_1.default().where((it, date) => +it.registrationDate == +date, new Date(2017, 11, 1)));
        assert.equal(list.length, 1);
        assert.equal(list[0].property, 'registrationDate');
        assert.equal(list[0].operator, '==');
        assert.equal(list[0].value.toISOString(), new Date(2017, 11, 1).toISOString());
    });
    it("should handle nested member expressions", () => {
        var list = repository.exposeFilters(new enumerable_1.default().where(car => car.type.make == "Toyota"));
        assert.equal(list.length, 1);
        assert.equal(list[0].property, 'type.make');
        assert.equal(list[0].operator, '==');
        assert.equal(list[0].value, 'Toyota');
    });
});
class CarRepository extends baserepository_1.default {
    constructor() {
        super();
    }
    read(id) {
        return Promise.reject(new Error('Not implemented'));
    }
    readAll(predicate) {
        return Promise.reject(new Error('Not implemented'));
    }
    delete(entity) {
        return Promise.reject(new Error('Not implemented'));
    }
    update(entity) {
        return Promise.reject(new Error('Not implemented'));
    }
    create(entity) {
        return Promise.reject(new Error('Not implemented'));
    }
    exposeFilters(query) {
        return super.getCriteria(query);
    }
}
//# sourceMappingURL=repository_readall.js.map