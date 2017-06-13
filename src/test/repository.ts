import * as assert from 'assert';

import Repository, { IRecordSetMeta } from './../repository/baserepository';
import Enumerable, { IEnumerable, OperatorType } from './../linq/enumerable';
import { WhereOperator } from './../linq/operators/whereoperator';
import { SkipOperator } from './../linq/operators/skipoperator';
import { TakeOperator } from './../linq/operators/takeoperator';


import { ExpressionType, IExpression, IIdentifierExpression, ILiteralExpression } from './../linq/expressions/expression';
import { LogicalOperatorType } from './../linq/expressions/logicalexpression';

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

interface ILocation {
    location: string
    zipcode: number
    ziparea: string
}

class CarRepository extends Repository<ICar, number>
{
    public read(id: number): Promise<ICar> {
        return new Enumerable(this).where( (it, id) => it.id == id, id).firstAsync();
    }

    public readAll(query: IEnumerable<ICar>, meta?: IRecordSetMeta): Promise<ICar[]> {
         let specialcar: ICar,
             cars = [
                <ICar>{ id: 1, location: 'SKIEN', registrationYear: 2016, type: { make: 'SAAB', model: '9-3' } },
                <ICar>{ id: 2, location: 'PORSGRUNN', registrationYear: 2010, type: { make: 'NISSAN', model: 'QASHQAI' } },
                <ICar>{ id: 3, location: 'PORSGRUNN', registrationYear: 2005, type: { make: 'SAAB', model: '9-3' } },
                <ICar>{ id: 4, location: 'LANGESUND', registrationYear: 2004, type: { make: 'NISSAN', model: 'LEAF' } },
                <ICar>{ id: 5, location: 'BREVIK', registrationYear: 2009, type: { make: 'TOYOTA', model: 'COROLLA' } },
                <ICar>{ id: 6, location: 'BREVIK', registrationYear: 2014, type: { make: 'HONDA', model: 'HRV' } },
                specialcar = <ICar>{ id: 7, location: 'HEISTAD', registrationYear: 2013, type: { make: 'TOYOTA', model: 'YARIS' } },
                <ICar>{ id: 8, location: 'LARVIK', registrationYear: 2009, type: { make: 'HONDA', model: 'CIVIC' } }
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

        let skip = query.operations.first(SkipOperator);
        if (skip) {
            query.operations.remove(skip); // removing it as we are doing this part at database level instead
        }

        let take = query.operations.first(TakeOperator);
        if (take) {
            query.operations.remove(take); // removing it as we are doing this part at database level instead
        }

        let where = query.operations.first(WhereOperator);
        if (where) cars = cars.filter(where.predicate);

        if (skip) cars = cars.slice(skip.count); // simulating paging at database level
        if (take) cars = cars.slice(0, take.count); // simulating paging at database level

        return Promise.resolve(cars); // unoptimized
    }

    public async create(car: ICar): Promise<ICar> {
        throw new Error('Not implemented');
    }

    public async update(car: ICar): Promise<boolean> {
        throw new Error('Not implemented');
    }

    public async delete(car: ICar): Promise<boolean> {
        throw new Error('Not implemented');
    }

    public exposeIfQueryIsPageable(query: IEnumerable<ICar>): boolean {
        return super.isQueryPageable(query);
    }

    public exposeCriteriaCount(query: IEnumerable<ICar>): number {
        return super.getCriteria(query).length;
    }
}

class LocationRepository extends Repository<ILocation, string>
{
    public read(id: string): Promise<ILocation> {
        return new Enumerable(this).where((it, id) => it.location == id, id).firstAsync();
    }

    public readAll(query: IEnumerable<ILocation>, meta?: IRecordSetMeta, parent?) {
        let locations = [
            <ILocation>{ location: 'SKIEN', zipcode: 3955, ziparea: 'Skien' },
            <ILocation>{ location: 'PORSGRUNN', zipcode: 3949, ziparea: 'Porsgrunn' },
            <ILocation>{ location: 'LANGESUND', zipcode: 3970, ziparea: 'Langesund' },
            <ILocation>{ location: 'HEISTAD', zipcode: 3943, ziparea: 'Porsgrunn' },
            <ILocation>{ location: 'BREVIK', zipcode: 3940, ziparea: 'Porsgrunn' }
        ]

        return Promise.resolve(locations);
    }

    public async create(car: ILocation): Promise<ILocation> {
        throw new Error('Not implemented');
    }

    public async update(car: ILocation): Promise<boolean> {
        throw new Error('Not implemented');
    }

    public async delete(car: ILocation): Promise<boolean> {
        throw new Error('Not implemented');
    }
}

describe("When using Repository", () => {
    beforeEach(() => {

    })

    it("should work with joins", async () => {
        let meta: IRecordSetMeta = <IRecordSetMeta>{},
            ar = new Enumerable(new CarRepository().getIterable(meta))
                .where(it => it.id == 7)
                .take(5)
                .join<ILocation, any>(new LocationRepository(), a => a.location, b => b.location, (a, b) => Object.assign({}, a), true)

        let t = await ar.toArrayAsync();

        assert.equal(t.length, 1);
        assert.equal(meta.totalLength, 1);
    })

    it("should work with optimized query", async () => {

        let repo = new CarRepository(),
            cars = await new Enumerable<ICar>(repo).where(it => it.id == 7).toArrayAsync();

        assert.ok(repo instanceof Repository);
        assert.equal(cars.length, 1)
        assert.equal(cars[0].id, 7);
    })

    it("should work with random query", async () => {

        let repo = new CarRepository(),
            cars = await new Enumerable<ICar>(repo).where(it => it.id == 6).toArrayAsync();

        assert.ok(repo instanceof Repository);
        assert.equal(cars.length, 1)
        assert.equal(cars[0].id, 6);
    })

    it("should be able to remove paging operations for manual handling", async () => {

        let repo = new CarRepository(),
            cars: Array<ICar>;

        cars = await new Enumerable(repo)
            .where(it => it.registrationYear >= 2005)
            .skip(5)
            .take(3)
            .toArrayAsync();

        assert.equal(cars.length, 2);
        assert.equal(cars[0].id, 7);

    })

    it("should be able to see that a query can't be pageable after plucking union expressions", async () => {
        let repo = new CarRepository(),
            query = new Enumerable<ICar>(repo).where(it => (it.registrationYear == 2017 || it.location == 'NO') && it.id >= 7);

        assert.equal(repo.exposeIfQueryIsPageable(query), false)
    })

    it("should be able to see that a query can be pageable after plucking union expressions", async () => {
        let repo = new CarRepository(),
            query = new Enumerable<ICar>(repo).where(it => it.location == 'NO' && it.registrationYear >= 2000);

        assert.equal(repo.exposeIfQueryIsPageable(query), true)
    })

    it("should be able to see that a query can be pageable after plucking union expressions that is common", async () => {
        let repo = new CarRepository(),
            query = new Enumerable<ICar>(repo).where(it => (it.location == 'NO') || (it.registrationYear >= 2000 && it.location == 'NO'));

        assert.equal(repo.exposeCriteriaCount(query), 1);
        assert.equal(repo.exposeIfQueryIsPageable(query), false)
    })
})