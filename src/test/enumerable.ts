import * as assert from 'assert';
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

    describe("with copy", () => {
        
        it("should be able to copy", async() => {
            let original = new Enumerable(cars).where(it => it.location == 'PORSGRUNN'),
                copy = original.copy()

            assert.equal(copy.toArray().length, 2)
        })

        it("should be able to copy without affect original", async() => {
            let original = new Enumerable(cars).where(it => it.registrationYear >= 2010),
                copy = original.copy().where(it => it.location == 'PORSGRUNN')

            assert.equal(original.toArray().length, 4)
            assert.equal(copy.toArray().length, 1)
        })
    })

    describe("with iterable", () => {

        it("should be able to iterate", async () => {
            let count = 0;

            for (let item of new Enumerable(cars).where(it => it.id > 0)) {
                count++;
            }

            assert.equal(count, 8);
        })

    })

    describe("with async iterable", () => {
        let delay: (delay: number) => void, 
            list: () => AsyncIterableIterator<ICar>;

        beforeEach(() => {
            
            delay = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));
            list = async function* () {
                yield <ICar>{ id: 1, location: 'SKIEN', registrationYear: 2016, type: { make: 'SAAB', model: '9-3' } }
                yield <ICar>{ id: 2, location: 'PORSGRUNN', registrationYear: 2010, optional: 'yes', type: { make: 'NISSAN', model: 'QASHQAI' } }
                
                await delay(10)
                    
                yield <ICar>{ id: 3, location: 'PORSGRUNN', registrationYear: 2005, type: { make: 'SAAB', model: '9-3' } }
                yield <ICar>{ id: 4, location: 'LANGESUND', registrationYear: 2004, optional: 'yes', type: { make: 'NISSAN', model: 'LEAF' } }
                yield Promise.resolve(<ICar>{ id: 5, location: 'BREVIK', registrationYear: 2009, optional: 'yes', type: { make: 'TOYOTA', model: 'COROLLA' } })
                yield <ICar>{ id: 6, location: 'BREVIK', registrationYear: 2014, optional: 'yes', type: { make: 'HONDA', model: 'HRV' } }
                yield Promise.resolve(<ICar>{ id: 7, location: 'HEISTAD', registrationYear: 2013, type: { make: 'TOYOTA', model: 'YARIS' } })
                yield <ICar>{ id: 8, location: 'LARVIK', registrationYear: 2009, type: { make: 'HONDA', model: 'CIVIC' } }
            }
        })

        it("should be able to iterate", async () => {
            let count = 0;

            for await (let item of new Enumerable(list()).where(it => it.id > 0)) {
                count++;
            }

            assert.equal(count, 8);
        })

        it("should be able to handle list of items", async () => {
            let hasItems = false;

            for await(let item of new Enumerable(list()).where(it => it.id == 3)) {
                hasItems = true;
                assert.equal(item.id, 3);
            }

            assert.ok(hasItems);
        })

        it("should be able to handle list of promises", async () => {
            let hasItems = false;

            for await(let item of new Enumerable(list()).where(it => it.id == 5)) {
                hasItems = true;
                assert.equal(item.id, 5);
            }

            assert.ok(hasItems);
        })

        it("test", () => {
            let parents = function* () {
                yield { id: 1, reg: 'Dolly Duck',  year: 1937 }
                yield { id: 2, reg: 'Donald', year: 1934 }
                yield { id: 3, reg: 'Skrue McDuck', year: 1947 }
            }

            let childs = function* () {
                yield { parent: 2, name: 'Ole', year: 1940 }
                yield { parent: 1, name: 'Hetti', year: 1953 }
                yield { parent: 2, name: 'Dole', year: 1940 }
                yield { parent: 2, name: 'Doffen', year: 1940 }
                yield { parent: 1, name: 'Netti', year: 1953 }
            }

            let donald = new Enumerable<any>(parents())
                .where(it => it.id == 2)
                .join<any, any>(
                    new Enumerable(childs()).select(it => <any>{ parent: it.parent, name: it.name }),
                    a => a.id, 
                    b => b.parent, 
                    (a, b) => Object.assign({}, a, { childs: b.toArray() } )
                )
                .first();

            // "{"id":2,"reg":"Donald","year":1934,"childs":[{"parent":2,"name":"Ole"},{"parent":2,"name":"Dole"},{"parent":2,"name":"Doffen"}]}"
        })
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
                .where(it => it.ziparea == 'Porsgrunn')
                
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

        it("should return nothing when an usolvable query is used", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>(),
                unknown;

            query.where(it => it.location == 'BREVIK' && unknown == true);

            let result = query.toArray(cars);

            assert.equal(result.length, 0);
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

        it("should return nothing when an usolvable query is used", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where("location eq 'BREVIK' and unkown eq true");
           
            let result = query.toArray(cars);

            assert.equal(result.length, 0);
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
            query.remap<ICar>((name) => {
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

    it("should skip 0", () => {
        var ar = new Enumerable(cars).skip(0).toArray();

        assert.equal(ar[0].id, 1);
        assert.equal(ar.length, 8);
    });

    it("should take MAX", () => {
        var ar = new Enumerable(cars).skip(0).take(Number.MAX_VALUE).toArray();

        assert.equal(ar[0].id, 1);
        assert.equal(ar.length, 8);
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

    it("should skip while year is greater than 2010", () => {
        var ar = new Enumerable(cars).skipWhile(it => it.registrationYear >= 2010).toArray();

        assert.ok(ar.length == 6);
        assert.ok(ar[0].id == 3);
    })

    it("should order by a property", () => {
        var ar = new Enumerable(cars).orderBy(it => it.location).toArray();
        
        assert.deepEqual(ar.map(item => item.location), ["BREVIK", "BREVIK", "HEISTAD", "LANGESUND", "LARVIK", "PORSGRUNN", "PORSGRUNN", "SKIEN"]);
    })

    it("should be able to get first element after order by a property", () => {
        var el = new Enumerable(cars).orderBy(it => it.location).first();

        assert.equal(el.id, 5);
    })

    it("should order by a string", () => {
        var ar = new Enumerable(cars).orderBy('location').toArray();
        
        assert.deepEqual(ar.map(item => item.location), ["BREVIK", "BREVIK", "HEISTAD", "LANGESUND", "LARVIK", "PORSGRUNN", "PORSGRUNN", "SKIEN"]);
    })

    it("should be able to get first element after order by a string", () => {
        var el = new Enumerable(cars).orderBy('location').first();

        assert.equal(el.id, 5);
    })

    it("should slice a portion", () => {
        var ar = new Enumerable(cars).slice(3, 6).toArray();

        assert.ok(ar.length == 3);
        assert.ok(ar[0].id == 4);
    })

    it("shouldn't slice a portion when a token is used", () => {
        var ar = new Enumerable(cars).slice('test').toArray();

        assert.ok(ar.length == 8);
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
            .select<ISimpleCar>(it => ({ id: it.id, make: it.type.make, model: it.type.model }))
            .first();

        assert.equal(car.id, 2);
        assert.equal(car.make, 'NISSAN');
        assert.equal(car.model, 'QASHQAI');
    })

    it("should be able to convert list by using select by string", () => {
        let car = new Enumerable(cars)
            .where(it => it.id == 2)
            .select('id, type/make')
            .first();

        assert.equal(car.id, 2);
        assert.equal(car.type.make, 'NISSAN')
    })

    it("should be able to get first Operator by class", () => {
        let query: Enumerable<ICar> = new Enumerable<ICar>();

        query.where(it => it.location == 'BREVIK');
        query.skip(5);
        query.take(3);
        query.skip(1);
        query.take(1);

        let op = query.operations.first(SkipOperator)

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
        assert.equal(op.count, 5);
    })

    it("should be able to get first Operator by class and remove it for manual operator handling", () => {
        let query: Enumerable<ICar> = new Enumerable<ICar>(cars),
            skip: SkipOperator<ICar>,
            skipCount: number;

        query.where(it => it.registrationYear >= 2000);
        query.take(8);
        query.skip(6);
        query.take(3);
        query.skip(1);

        assert.equal(Array.from(query.operations.values()).length, 5);

        skip = query.operations.first(OperatorType.Skip);
        
        assert.notEqual(skip, null);
        assert.equal(skip.type, OperatorType.Skip);
        assert.equal(skip.count, 6);

        query.operations.remove(skip);

        skip = query.operations.first(OperatorType.Skip);

        assert.notEqual(skip, null);
        assert.equal(skip.type, OperatorType.Skip);
        assert.equal(skip.count, 1);

        assert.equal(Array.from(query.operations.values()).length, 4);

        let mycars = query.toArray();

        assert.equal(mycars.length, 2);
    })
});
