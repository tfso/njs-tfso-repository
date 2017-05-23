﻿import * as assert from 'assert';
import Enumerable, { IEnumerable, OperatorType } from './../linq/enumerable';
import { SkipOperator } from './../linq/operators/skipoperator';
import { WhereOperator } from './../linq/operators/whereoperator';

interface ICar {

    id: number
    location: string

    optional?: string

    registrationYear: number

    type: {
        make: string
        model: string
    }
}

interface ISimpleCar {
    id: number
    make: string
    model: string
}

interface ILocation {
    location: string
    zipcode: number
    ziparea: string
}

describe("When using Enumerable", () => {
    var cars: Array<ICar>,
        locations: Array<ILocation>;

    beforeEach(() => {
        cars = [
            <ICar>{ id: 1, location: 'SKIEN', registrationYear: 2016, type: { make: 'SAAB', model: '9-3' } },
            <ICar>{ id: 2, location: 'PORSGRUNN', registrationYear: 2010, optional: 'yes', type: { make: 'NISSAN', model: 'QASHQAI' } },
            <ICar>{ id: 3, location: 'PORSGRUNN', registrationYear: 2005, type: { make: 'SAAB', model: '9-3' } },
            <ICar>{ id: 4, location: 'LANGESUND', registrationYear: 2004, optional: 'yes', type: { make: 'NISSAN', model: 'LEAF' } },
            <ICar>{ id: 5, location: 'BREVIK', registrationYear: 2009, optional: 'yes', type: { make: 'TOYOTA', model: 'COROLLA' } },
            <ICar>{ id: 6, location: 'BREVIK', registrationYear: 2014, optional: 'yes', type: { make: 'HONDA', model: 'HRV' } },
            <ICar>{ id: 7, location: 'HEISTAD', registrationYear: 2013, type: { make: 'TOYOTA', model: 'YARIS' } },
            <ICar>{ id: 8, location: 'LARVIK', registrationYear: 2009, type: { make: 'HONDA', model: 'CIVIC' } }
        ];

        locations = [
            <ILocation>{ location: 'SKIEN', zipcode: 3955, ziparea: 'Skien' },
            <ILocation>{ location: 'PORSGRUNN', zipcode: 3949, ziparea: 'Porsgrunn' },
            <ILocation>{ location: 'LANGESUND', zipcode: 3970, ziparea: 'Langesund' },
            <ILocation>{ location: 'HEISTAD', zipcode: 3943, ziparea: 'Porsgrunn' },
            <ILocation>{ location: 'BREVIK', zipcode: 3940, ziparea: 'Porsgrunn' }
        ]
    })

    describe("with joins", () => {

        it("should be able to do inner join", () => {
            let car = new Enumerable<ICar>(cars)
                .where(it => it.id == 2)
                .join<ILocation, any>(new Enumerable(locations).select(it => <any>{ location: it.location, city: it.ziparea }), a => a.location, b => b.location, (a, b) => Object.assign({}, a, b.first()))
                .first();

            assert.ok(car != null);
            assert.equal(car.id, 2);
            assert.equal(car.city, 'Porsgrunn');
        })

        it("should be able to get all cars from city 'Porsgrunn'", () => {

            let cities = new Enumerable<ILocation>(locations)
                .where(it => it.ziparea == 'Porsgrunn');

            let list = new Enumerable<ICar>(cars)
                .join<ILocation, any>(cities, outer => outer.location, inner => inner.location, (outer, inner) => outer)
                .toArray();
                
            assert.equal(list.length, 5);
        })
    })

    describe("with Lambda query", () => {

        it("should be able to do a simple query", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where(it => it.location == 'BREVIK');
            query.skip(1);
            query.take(3);

            let result = query.toArray(cars);

            assert.equal(result.length, 1);
        })

        it("should be able to do a simple query using one named parameters", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where((it, loc) => it.location == loc, 'BREVIK');
            query.skip(1);
            query.take(3);

            let result = query.toArray(cars);

            assert.equal(result.length, 1);
        })

        it("should be able to do a simple query using two named parameters", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where((it, loc, year) => it.location == loc && it.registrationYear >= year, 'BREVIK', 2010);

            let result = query.toArray(cars);

            assert.equal(result.length, 1);
        })

        it("should be able to do a simple query with a nested model", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where(it => it.type.make == 'TOYOTA');

            let result = query.toArray(cars);

            assert.equal(result.length, 2);
        })
    })

    describe("with OData query", () => {

        it("should be able to do a simple query", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where("location eq 'BREVIK'");
            query.skip(1);
            query.take(3);

            let result = query.toArray(cars);

            assert.equal(result.length, 1);
        })

        it("should be able to do a complex query", () => {

            let result = new Enumerable<ICar>(cars)
                .where("((id eq 7) or (location eq 'PORSGRUNN')) and registrationYear ge 2000")
                .toArray();

            assert.equal(result.length, 3);
        })

        it("should be able to do a complex query with with optional property", () => {
            let result = new Enumerable<ICar>(cars)
                .where("((type/make eq 'TOYOTA') or (optional eq 'yes')) and registrationYear ge 2000")
                .toArray();

            assert.equal(result.length, 5);
        })

        it("should be able to do a simple query with a nested model", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where("type/make eq 'TOYOTA'");

            let result = query.toArray(cars);
            assert.equal(result.length, 2);
        })

        it("should be able to rename a flat model", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where("tolower(Place) eq 'brevik'");
            query.remap((name) => {
                if (name == 'Place') return 'location';
            })

            let result = query.toArray(cars);
            assert.equal(result.length, 2);

            let where = query.operations.first(WhereOperator);
        })

        it("should be able to rename a value in a flat model", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where("tolower(location) eq 'BREVIK'");
            query.remap((name, value) => {
                if (name == 'location') return value.toLowerCase();
            })

            let result = query.toArray(cars);
            assert.equal(result.length, 2);

            let where = query.operations.first(WhereOperator);
        })

        it("should be able to rename a nested model", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where("tolower(car/make) eq 'toyota'");
            query.remap((name) => {
                if (name == 'car.make') return 'type.make';
            });

            let result = query.toArray(cars);
            assert.equal(result.length, 2);

            let where = query.operations.first(WhereOperator);
        })
    })

    it("should take top 1", () => {
        var ar = new Enumerable(cars).take(1).toArray();

        assert.ok(ar.length == 1);
    });

    it("should skip 5", () => {
        var ar = new Enumerable(cars).skip(5).toArray();

        assert.ok(ar[0].id == 6);
    });

    it("should skip 5 and take 3", () => {
        var ar = new Enumerable(cars).skip(5).take(3).toArray();

        assert.ok(ar.length == 3);
        assert.ok(ar[0].id == 6);
    });

    it("should order by a property", () => {
        var ar = new Enumerable(cars).orderBy(it => it.location).toArray();
        
        assert.deepEqual(ar.map(item => item.location), ["BREVIK", "BREVIK", "HEISTAD", "LANGESUND", "LARVIK", "PORSGRUNN", "PORSGRUNN", "SKIEN"]);
    })

    it("should be able to get first element", () => {
        var el = new Enumerable(cars).orderBy(it => it.location).first();

        assert.equal(el.id, 5);
    })

    it("should be able to iterate", () => {
        var enumerable = new Enumerable(cars).take(3),
            ar = Array.from(enumerable);

        assert.equal(ar.length, 3);
    })

    it("should just work", () => {
        let query: IEnumerable<ICar> = new Enumerable<ICar>();

        query.skip(5)
        query.take(3);
        
        var ar = query.toArray(cars);

        assert.ok(ar.length == 3);
        assert.ok(ar[0].id == 6);
    })

    it("should iterate through operations", () => {
        let query: IEnumerable<ICar> = new Enumerable<ICar>();

        query.skip(5);
        query.take(3);


        var operations = (<Enumerable<ICar>>query).operations.values();

        var count = 0;
        for (let operator of operations) {
            if (operator) {
                count++;
            }
        }

        assert.equal(count, 2);
    })

    it("should be able to convert list by using select", () => {
        let car = new Enumerable(cars)
            .where(it => it.id == 2)
            .select<ISimpleCar>(it => <ISimpleCar>{ id: it.id, make: it.type.make, model: it.type.model })
            .first();

        assert.equal(car.id, 2);
        assert.equal(car.make, 'NISSAN');
        assert.equal(car.model, 'QASHQAI');
    })

    it("should be able to get first Operator by class", () => {
        let query: Enumerable<ICar> = new Enumerable<ICar>();

        query.where(it => it.location == 'BREVIK');
        query.skip(5);
        query.take(3);
        query.skip(1);
        query.take(1);

        let op = query.operations.first(SkipOperator);

        assert.notEqual(op, null);
        assert.equal(op.type, OperatorType.Skip);
        assert.equal(op.count, 5);
    })

    it("should be able to get first Operator by type", () => {
        let query: Enumerable<ICar> = new Enumerable<ICar>();

        query.where(it => it.location == 'BREVIK');
        query.skip(5);
        query.take(3);
        query.skip(1);
        query.take(1);

        let op = query.operations.first(OperatorType.Skip);

        assert.notEqual(op, null);
        assert.equal(op.type, OperatorType.Skip);
        assert.equal((<SkipOperator<ICar>>op).count, 5);
    })

    it("should be able to get first Operator by class and remove it for manual operator handling", () => {
        let query: Enumerable<ICar> = new Enumerable<ICar>(),
            skip: SkipOperator<ICar>,
            skipCount: number;

        query.where(it => it.location == 'BREVIK');
        query.skip(5);
        query.take(3);
        query.skip(1);
        query.take(1);

        skip = query.operations.first(SkipOperator);
        skipCount = skip.count;

        assert.notEqual(skip, null);
        assert.equal(skip.type, OperatorType.Skip);
        assert.equal(skip.count, 5);

        query.operations.remove(skip);

        skip = query.operations.first(SkipOperator);

        assert.notEqual(skip, null);
        assert.equal(skip.type, OperatorType.Skip);
        assert.equal(skip.count, 1);
    })
});
