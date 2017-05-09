import * as assert from 'assert';
import Enumerable, { IEnumerable, OperatorType } from './../linq/enumerable';
import { SkipOperator } from './../linq/operators/skipoperator';
import { WhereOperator } from './../linq/operators/whereoperator';

interface ICar {

    id: number
    location: string

    registrationYear: number

    type: {
        make: string
        model: string
    }
}

describe("When using Enumerable", () => {
    var list: Array<ICar>;

    beforeEach(() => {
        list = [
            <ICar>{ id: 1, location: 'SKIEN', registrationYear: 2016, type: { make: 'SAAB', model: '9-3' } },
            <ICar>{ id: 2, location: 'PORSGRUNN', registrationYear: 2010, type: { make: 'NISSAN', model: 'QASHQAI' } },
            <ICar>{ id: 3, location: 'PORSGRUNN', registrationYear: 2005, type: { make: 'SAAB', model: '9-3' } },
            <ICar>{ id: 4, location: 'LANGESUND', registrationYear: 2004, type: { make: 'NISSAN', model: 'LEAF' } },
            <ICar>{ id: 5, location: 'BREVIK', registrationYear: 2009, type: { make: 'TOYOTA', model: 'COROLLA' } },
            <ICar>{ id: 6, location: 'BREVIK', registrationYear: 2014, type: { make: 'HONDA', model: 'HRV' } },
            <ICar>{ id: 7, location: 'HEISTAD', registrationYear: 2013, type: { make: 'TOYOTA', model: 'YARIS' } },
            <ICar>{ id: 8, location: 'LARVIK', registrationYear: 2009, type: { make: 'HONDA', model: 'CIVIC' } }
        ];        
    })

    describe("with Javascript query", () => {

        it("should be able to do a simple query", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where(it => it.location == 'BREVIK');
            query.skip(1);
            query.take(3);

            let result = query.toArray(list);

            assert.equal(result.length, 1);
        })

        it("should be able to do a simple query with a nested model", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where(it => it.type.make == 'TOYOTA');

            let result = query.toArray(list);
            assert.equal(result.length, 2);
        })
    })

    describe("with OData query", () => {

        it("should be able to do a simple query", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where("location eq 'BREVIK'");
            query.skip(1);
            query.take(3);

            let result = query.toArray(list);

            assert.equal(result.length, 1);
        })

        it("should be able to do a simple query with a nested model", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where("type/make eq 'TOYOTA'");

            let result = query.toArray(list);
            assert.equal(result.length, 2);
        })

        it("should be able to rename a flat model", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where("tolower(Place) eq 'brevik'");
            query.rename({ from: 'Place', to: 'location' })

            let result = query.toArray(list);
            assert.equal(result.length, 2);

            let where = query.operations.first(WhereOperator);
        })

        it("should be able to rename a nested model", () => {
            let query: Enumerable<ICar> = new Enumerable<ICar>();

            query.where("tolower(car/make) eq 'toyota'");

            //query.rename(<any>{ car: { make: 'type.make',  } });

            query.rename({ from: 'car.make', to: 'type.make' })

            let result = query.toArray(list);
            assert.equal(result.length, 2);

            let where = query.operations.first(WhereOperator);
        })
    })

    it("should take top 1", () => {
        var ar = new Enumerable(list).take(1).toArray();

        assert.ok(ar.length == 1);
    });

    it("should skip 5", () => {
        var ar = new Enumerable(list).skip(5).toArray();

        assert.ok(ar[0].id == 6);
    });

    it("should skip 5 and take 3", () => {
        var ar = new Enumerable(list).skip(5).take(3).toArray();

        assert.ok(ar.length == 3);
        assert.ok(ar[0].id == 6);
    });

    it("should order by a property", () => {
        var ar = new Enumerable(list).orderBy(it => it.location).toArray();
        
        assert.deepEqual(ar.map(item => item.location), ["BREVIK", "BREVIK", "HEISTAD", "LANGESUND", "LARVIK", "PORSGRUNN", "PORSGRUNN", "SKIEN"]);
    })

    it("should be able to iterate", () => {
        var ar = new Enumerable(list).take(3);

        assert.equal(Array.from(ar).length, 3);
    })

    it("should just work", () => {
        let query: IEnumerable<ICar> = new Enumerable<ICar>();

        query.skip(5)
        query.take(3);
        
        var ar = query.toArray(list);

        assert.ok(ar.length == 3);
        assert.ok(ar[0].id == 6);
    })

    it("should be able to get first element", () => {
        var el = new Enumerable(list).orderBy(it => it.location).first();

        assert.equal(el.id, 5);
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
