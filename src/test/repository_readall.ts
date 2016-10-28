import * as assert from 'assert';
import Repository from './../repository/baserepository';
import Enumerable, { IEnumerable } from './../linq/enumerable';

describe("When using repository to read all", () => {
    var repository: CarRepository;

    beforeEach(() => {
        repository = new CarRepository();
    })

    it("should handle non existing where", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().skip(5).take(3))

        assert.ok(list != null, "expected filters")
        assert.ok(list.groups.length == 0, "Expected 0 filter")
    })

    it("should handle multiple or/and expressions", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => car.registrationYear >= 2016 || car.location == 'NO' && car.registrationYear > 2000 && car.id != null && (car.registrationYear > 2000 || car.registrationYear == 1999)))

        assert.ok(list.groups.length == 2, "Expected two filters")
        assert.ok(list.groups[0].criteria.length == 1, "Expected one criteria for first filter");
        assert.ok(list.groups[1].criteria.length == 3, "Expected three criteria for second filter");
    })

    it("should return a single filter", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => car.location == 'PORSGRUNN'));

        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 1, "Expected one criteria");
    })

    it("should return a single filter with two criteria", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => car.registrationYear > 2015 && car.location == 'PORSGRUNN'));

        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 2, "Expected two criteria");
    })

    it("should return a two filters with one criteria each", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => car.registrationYear > 2015 || car.location == 'PORSGRUNN'));

        assert.ok(list.groups.length == 2, "Expected two filters");
        assert.ok(list.groups[0].criteria.length == 1 && list.groups[1].criteria.length == 1, "Expected one criteria in each filter");
    })

    it("should return a criteria using property to be equal value", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => car.location == 'NO'));

        assert.ok(list.groups.length == 1, "Expected a single filter")
        assert.ok(list.groups[0].criteria.length == 1, "Expected a single criteria");
        assert.ok(list.groups[0].criteria[0].property == "location", "Expected property to be 'location'");
        assert.ok(list.groups[0].criteria[0].value == "NO", "Expected value to be 'NO'");
    })

    it("should return a criteria using property to be greater than value", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => car.registrationYear > 2000));

        assert.ok(list.groups.length == 1, "Expected a single filter")
        assert.ok(list.groups[0].criteria.length == 1, "Expected a single criteria");
        assert.ok(list.groups[0].criteria[0].property == "registrationYear", "Expected property to be 'registrationYear'");
        assert.ok(list.groups[0].criteria[0].value == 2000, "Expected value to be 2000");
        assert.ok(list.groups[0].criteria[0].operator == ">", "Expected operator to be greater than");
    })

    it("should return a criteria using property to be greater than value just the other way around", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => 2000 < car.registrationYear));

        assert.ok(list.groups.length == 1, "Expected a single filter")
        assert.ok(list.groups[0].criteria.length == 1, "Expected a single criteria");
        assert.ok(list.groups[0].criteria[0].property == "registrationYear", "Expected property to be 'registrationYear'");
        assert.ok(list.groups[0].criteria[0].value == 2000, "Expected value to be 2000");
        assert.ok(list.groups[0].criteria[0].operator == ">", "Expected operator to be greater than");
    })

    it("should cast an exception if a unsolvable expression is used", () => {
        assert.throws(
            () => {
                repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => this.unknown == 5));
            },
            Error
        );
    })

    it("should intersection filter properties that is common ", () => {

        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => (car.registrationYear == 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)));
        var intersection = list.getIntersection();

        assert.ok(intersection.length == 1, "Expected one criteria from intersection");
        assert.ok(intersection[0].property == "registrationYear", "Expected property to be 'registrationYear'");
    })

    it("should intersection filter properties that is not common", () => {

        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => (car.registrationYear > 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)));
        var intersection = list.getIntersection();

        assert.ok(intersection.length == 0, "Expected zero criteria from intersection");
    })

    it("should handle method calls", () => {

        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => car.location.toLowerCase() == "no"));

        if (Date.now() < new Date(2016, 11, 1).getTime())
            return;

        assert.ok(list.groups.length == 1, "Expected a single filter");
        assert.ok(list.groups[0].criteria.length == 1, "Expected a single criteria");
    })
});


interface ICar {

    id: number
    location: string

    registrationYear: number
}

class CarRepository extends Repository<ICar, number>
{
    constructor() {
        super();
    }

    public read(id) {
        return Promise.reject<ICar>(new Error('Not implemented'));
    }

    public readAll(predicate) {
        return Promise.reject<ICar[]>(new Error('Not implemented'));
    }

    public delete(entity) {
        return Promise.reject<boolean>(new Error('Not implemented'));
    }

    public update(entity) {
        return Promise.reject<boolean>(new Error('Not implemented'));
    }

    public create(entity: ICar) {
        return Promise.reject<ICar>(new Error('Not implemented'));
    }

    public exposeFilters(query: IEnumerable<ICar>) {
        return super.getFilters(query);
    }
}