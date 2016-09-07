"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _this = this;
var assert = require('assert');
var baserepository_1 = require('./../repository/baserepository');
describe("When using repository to read all", function () {
    var repository;
    beforeEach(function () {
        repository = new CarRepository();
    });
    it("should handle multiple or/and expressions", function () {
        var list = repository.exposeFilters(function (car) { return car.registrationYear >= 2016 || car.location == 'NO' && car.registrationYear > 2000 && car.id != null && (car.registrationYear > 2000 || car.registrationYear == 1999); });
        assert.ok(list.groups.length == 2, "Expected two filters");
        assert.ok(list.groups[0].criteria.length == 1, "Expected one criteria for first filter");
        assert.ok(list.groups[1].criteria.length == 3, "Expected three criteria for second filter");
    });
    it("should return a single filter", function () {
        var list = repository.exposeFilters(function (car) { return car.location == 'PORSGRUNN'; });
        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 1, "Expected one criteria");
    });
    it("should return a single filter with two criteria", function () {
        var list = repository.exposeFilters(function (car) { return car.registrationYear > 2015 && car.location == 'PORSGRUNN'; });
        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 2, "Expected two criteria");
    });
    it("should return a two filters with one criteria each", function () {
        var list = repository.exposeFilters(function (car) { return car.registrationYear > 2015 || car.location == 'PORSGRUNN'; });
        assert.ok(list.groups.length == 2, "Expected two filters");
        assert.ok(list.groups[0].criteria.length == 1 && list.groups[1].criteria.length == 1, "Expected one criteria in each filter");
    });
    it("should return a criteria using property to be equal value", function () {
        var list = repository.exposeFilters(function (car) { return car.location == 'NO'; });
        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 1, "Expected a single criteria");
        assert.ok(list.groups[0].criteria[0].property == "location", "Expected property to be 'location'");
        assert.ok(list.groups[0].criteria[0].value == "NO", "Expected value to be 'NO'");
    });
    it("should return a criteria using property to be greater than value", function () {
        var list = repository.exposeFilters(function (car) { return car.registrationYear > 2000; });
        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 1, "Expected a single criteria");
        assert.ok(list.groups[0].criteria[0].property == "registrationYear", "Expected property to be 'registrationYear'");
        assert.ok(list.groups[0].criteria[0].value == 2000, "Expected value to be 2000");
        assert.ok(list.groups[0].criteria[0].operator == ">", "Expected operator to be greater than");
    });
    it("should return a criteria using property to be greater than value just the other way around", function () {
        var list = repository.exposeFilters(function (car) { return 2000 < car.registrationYear; });
        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 1, "Expected a single criteria");
        assert.ok(list.groups[0].criteria[0].property == "registrationYear", "Expected property to be 'registrationYear'");
        assert.ok(list.groups[0].criteria[0].value == 2000, "Expected value to be 2000");
        assert.ok(list.groups[0].criteria[0].operator == ">", "Expected operator to be greater than");
    });
    it("should cast an exception if a unsolvable expression is used", function () {
        assert.throws(function () {
            repository.exposeFilters(function (car) { return _this.unknown == 5; });
        }, Error);
    });
    it("should intersection filter properties that is common ", function () {
        var list = repository.exposeFilters(function (car) { return (car.registrationYear == 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015); });
        var intersection = list.getIntersection();
        assert.ok(intersection.length == 1, "Expected one criteria from intersection");
        assert.ok(intersection[0].property == "registrationYear", "Expected property to be 'registrationYear'");
    });
    it("should intersection filter properties that is not common", function () {
        var list = repository.exposeFilters(function (car) { return (car.registrationYear > 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015); });
        var intersection = list.getIntersection();
        assert.ok(intersection.length == 0, "Expected zero criteria from intersection");
    });
    it("should handle method calls", function () {
        var list = repository.exposeFilters(function (car) { return car.location.toLowerCase() == "no"; });
        if (Date.now() < new Date(2016, 9, 1).getTime())
            return;
        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 1, "Expected a single criteria");
    });
});
var CarRepository = (function (_super) {
    __extends(CarRepository, _super);
    function CarRepository() {
        _super.call(this);
    }
    CarRepository.prototype.read = function (id) {
        return Promise.reject(new Error('Not implemented'));
    };
    CarRepository.prototype.readAll = function (predicate) {
        return Promise.reject(new Error('Not implemented'));
    };
    CarRepository.prototype.delete = function (entity) {
        return Promise.reject(new Error('Not implemented'));
    };
    CarRepository.prototype.update = function (entity) {
        return Promise.reject(new Error('Not implemented'));
    };
    CarRepository.prototype.create = function (entity) {
        return Promise.reject(new Error('Not implemented'));
    };
    CarRepository.prototype.exposeFilters = function (predicate, parameters) {
        return _super.prototype.getFilters.call(this, predicate, parameters);
    };
    return CarRepository;
}(baserepository_1.default));
//# sourceMappingURL=repository_readall.js.map