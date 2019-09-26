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
        assert.ok(list.length == 0, "Expected 0 filter")
    })

    it("should handle multiple or/and expressions", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => car.registrationYear >= 2016 || car.location == 'NO' && car.registrationYear > 2000 && car.id != null && (car.registrationYear > 2000 || car.registrationYear == 1999)))

        assert.ok(list.length == 0, "Expected non common filters")
    })

    it("should return a single filter", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => car.location == 'PORSGRUNN'));

        assert.ok(list.length == 1, "Expected one criteria");
    })

    it("should return a single filter with two criteria", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => car.registrationYear > 2015 && car.location == 'PORSGRUNN'));

        assert.ok(list.length == 2, "Expected two criteria");
    })

    it("should return a criteria using property to be equal value", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => car.location == 'NO'));

        assert.ok(list.length == 1, "Expected a single criteria");
        assert.ok(list[0].property == "location", "Expected property to be 'location'");
        assert.ok(list[0].value == "NO", "Expected value to be 'NO'");
    })

    it("should return a criteria using property to be greater than value", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => car.registrationYear > 2000));

        assert.ok(list.length == 1, "Expected a single criteria");
        assert.ok(list[0].property == "registrationYear", "Expected property to be 'registrationYear'");
        assert.ok(list[0].value == 2000, "Expected value to be 2000");
        assert.ok(list[0].operator == ">", "Expected operator to be greater than");
    })

    it("should return a criteria using property to be greater than value just the other way around", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => 2000 < car.registrationYear));

        assert.ok(list.length == 1, "Expected a single criteria");
        assert.ok(list[0].property == "registrationYear", "Expected property to be 'registrationYear'");
        assert.ok(list[0].value == 2000, "Expected value to be 2000");
        assert.ok(list[0].operator == ">", "Expected operator to be greater than");
    })

    //it("should cast an exception if a unsolvable expression is used", () => {
    //    assert.throws(
    //        () => {
    //            repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => this.unknown == 5));
    //        },
    //        Error
    //    );
    //})

    it("should intersection filter properties that is common ", () => {
        var intersection = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => (car.registrationYear == 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)));
        
        assert.ok(intersection.length == 1, "Expected one criteria from intersection");
        assert.ok(intersection[0].property == "registrationYear", "Expected property to be 'registrationYear'");
    })

    it("should intersection filter properties that is not common", () => {
        var intersection = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => (car.registrationYear > 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)));

        assert.ok(intersection.length == 0, "Expected zero criteria from intersection");
    })

    it("should handle method calls", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where((car: ICar) => car.location.toLowerCase() == "no"));

        if (Date.now() < new Date(2019, 10, 1).getTime())
            return;

        assert.ok(false);

        //assert.ok(list.length == 1, "Expected a single criteria");
        //assert.ok(list[0].method == "toLowerCase");
    })

    it("should handle some unary expressions", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where( (it, date) => +it.registrationDate == +date, new Date(2017,11,1)))

        assert.equal(list.length, 1);
        assert.equal(list[0].property, 'registrationDate')
        assert.equal(list[0].operator, '==');
        assert.equal(list[0].value.toISOString(), new Date(2017,11,1).toISOString());
    })

    it("should handle nested member expressions", () => {
        var list = repository.exposeFilters(new Enumerable<ICar>().where(car => car.type.make == "Toyota"));

        assert.equal(list.length, 1);
        assert.equal(list[0].property, 'type.make')
        assert.equal(list[0].operator, '==');
        assert.equal(list[0].value, 'Toyota');

    })
});


interface ICar {

    id: number
    location: string

    registrationYear: number
    registrationDate: Date

    type: {
        make: string
        model: string
    }
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
        return super.getCriteria(query);
    }
}