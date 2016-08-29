"use strict";
const assert = require('assert');
const repository_1 = require('./../src/repository/repository');
describe("When using repository to read all", () => {
    var repository;
    beforeEach(() => {
        repository = new CarRepository();
    });
    it("should handle multiple or/and expressions", () => {
        var list = repository.exposeFilters((car) => car.registrationYear >= 2016 || car.location == 'NO' && car.registrationYear > 2000 && car.id != null && (car.registrationYear > 2000 || car.registrationYear == 1999));
        assert.ok(list.groups.length == 2, "Expected two filters");
        assert.ok(list.groups[0].criteria.length == 1, "Expected one criteria for first filter");
        assert.ok(list.groups[1].criteria.length == 3, "Expected three criteria for second filter");
    });
    it("should return a single filter", () => {
        var list = repository.exposeFilters((car) => car.location == 'PORSGRUNN');
        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 1, "Expected one criteria");
    });
    it("should return a single filter with two criteria", () => {
        var list = repository.exposeFilters((car) => car.registrationYear > 2015 && car.location == 'PORSGRUNN');
        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 2, "Expected two criteria");
    });
    it("should return a two filters with one criteria each", () => {
        var list = repository.exposeFilters((car) => car.registrationYear > 2015 || car.location == 'PORSGRUNN');
        assert.ok(list.groups.length == 2, "Expected two filters");
        assert.ok(list.groups[0].criteria.length == 1 && list.groups[1].criteria.length == 1, "Expected one criteria in each filter");
    });
    it("should return a criteria using property to be equal value", () => {
        var list = repository.exposeFilters((car) => car.location == 'NO');
        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 1, "Expected a single criteria");
        assert.ok(list.groups[0].criteria[0].property == "location", "Expected property to be 'location'");
        assert.ok(list.groups[0].criteria[0].value == "NO", "Expected value to be 'NO'");
    });
    it("should return a criteria using property to be greater than value", () => {
        var list = repository.exposeFilters((car) => car.registrationYear > 2000);
        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 1, "Expected a single criteria");
        assert.ok(list.groups[0].criteria[0].property == "registrationYear", "Expected property to be 'registrationYear'");
        assert.ok(list.groups[0].criteria[0].value == 2000, "Expected value to be 2000");
        assert.ok(list.groups[0].criteria[0].operator == ">", "Expected operator to be greater than");
    });
    it("should return a criteria using property to be greater than value just the other way around", () => {
        var list = repository.exposeFilters((car) => 2000 < car.registrationYear);
        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 1, "Expected a single criteria");
        assert.ok(list.groups[0].criteria[0].property == "registrationYear", "Expected property to be 'registrationYear'");
        assert.ok(list.groups[0].criteria[0].value == 2000, "Expected value to be 2000");
        assert.ok(list.groups[0].criteria[0].operator == ">", "Expected operator to be greater than");
    });
    it("should cast an exception if a unsolvable expression is used", () => {
        assert.throws(() => {
            repository.exposeFilters((car) => this.unknown == 5);
        }, Error);
    });
    it("should intersection filter properties that is common ", () => {
        var list = repository.exposeFilters((car) => (car.registrationYear == 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015));
        var intersection = list.getIntersection();
        assert.ok(intersection.length == 1, "Expected one criteria from intersection");
        assert.ok(intersection[0].property == "registrationYear", "Expected property to be 'registrationYear'");
    });
    it("should intersection filter properties that is not common", () => {
        var list = repository.exposeFilters((car) => (car.registrationYear > 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015));
        var intersection = list.getIntersection();
        assert.ok(intersection.length == 0, "Expected zero criteria from intersection");
    });
    it("should handle method calls", () => {
        var list = repository.exposeFilters((car) => car.location.toLowerCase() == "no");
        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 1, "Expected a single criteria");
    });
});
class CarRepository extends repository_1.Repository {
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
    exposeFilters(predicate, parameters) {
        return super.getFilters(predicate, parameters);
    }
}
//# sourceMappingURL=repository_readall.js.map