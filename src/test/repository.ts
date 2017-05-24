import * as assert from 'assert';

import Repository from './../repository/baserepository';
import Enumerable, { IEnumerable, OperatorType } from './../linq/enumerable';


interface ICar {
    id: number
}

class CarRepository extends Repository<ICar, number> implements AsyncIterable<ICar>
{
    public async read(id: number): Promise<ICar> {
        throw new Error('Not implemented');
    }

    public readAll(query: IEnumerable<ICar>): Promise<ICar[]> {
        let cars = [
            <ICar>{ id: 1, location: 'SKIEN', registrationYear: 2016, type: { make: 'SAAB', model: '9-3' } },
            <ICar>{ id: 2, location: 'PORSGRUNN', registrationYear: 2010, type: { make: 'NISSAN', model: 'QASHQAI' } },
            <ICar>{ id: 3, location: 'PORSGRUNN', registrationYear: 2005, type: { make: 'SAAB', model: '9-3' } },
            <ICar>{ id: 4, location: 'LANGESUND', registrationYear: 2004, type: { make: 'NISSAN', model: 'LEAF' } },
            <ICar>{ id: 5, location: 'BREVIK', registrationYear: 2009, type: { make: 'TOYOTA', model: 'COROLLA' } },
            <ICar>{ id: 6, location: 'BREVIK', registrationYear: 2014, type: { make: 'HONDA', model: 'HRV' } },
            <ICar>{ id: 7, location: 'HEISTAD', registrationYear: 2013, type: { make: 'TOYOTA', model: 'YARIS' } },
            <ICar>{ id: 8, location: 'LARVIK', registrationYear: 2009, type: { make: 'HONDA', model: 'CIVIC' } }
        ];

       return Promise.resolve(cars); // query.toArray(cars);
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

    private async * asyncIterator(query?: IEnumerable<ICar>): AsyncIterableIterator<ICar> {    
        let iterator = this.readAll(null);
        
        if (iterator instanceof Promise)
            iterator = await iterator;



        //yield* iterator;
    }

    [Symbol.asyncIterator] = (query?: IEnumerable<ICar>) => {
        return this.asyncIterator();
    }
}

describe("When using Repository", () => {
    

    beforeEach(() => {

    })

    it("should work", async () => {

        let repo = new CarRepository();

        assert.ok(repo instanceof Repository);

        for await(let item of new Enumerable<ICar>(repo).where(it => it.id > 0))
        {
            if(item) {

            }
        }


    })
})