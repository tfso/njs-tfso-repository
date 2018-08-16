import * as assert from 'assert';

import { SkipOperator } from './../linq/operators/skipoperator';
import { WhereOperator } from './../linq/operators/whereoperator';

//(Symbol as any).asyncIterator = Symbol.asyncIterator || "__@@asyncIterator__";

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

describe("When using Operator", () => {

    describe("for iterable", () => {
        let cars: Array<ICar>;

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
        })

        describe("Skip", () => {

            it("it should be able to iterate", async () => {
                let result: Array<ICar> = [];
                for (let item of new SkipOperator<ICar>(5).evaluate(cars)) {
                    result.push(item);
                }

                assert.equal(result.length, 3);
            });

            it("it should be able to iterate when it is removed", async () => {
                let skip = new SkipOperator<ICar>(5),
                    result: Array<ICar> = [];

                skip.remove();
                for await (let item of skip.evaluate(cars)) {
                    result.push(item);
                }

                assert.equal(result.length, 8);
            });
        })
    })

    describe("for asyncIterable", () => {
        let cars; //: () => AsyncIterableIterator<ICar>;

        beforeEach(() => {
            let delay = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

            cars = async function* () {
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

        describe("Skip", () => {

            it("it should be able to iterate", async () => {
                
                let result: Array<ICar> = [];      
                for await (let item of new SkipOperator<ICar>(5).evaluateAsync(cars())) {
                    result.push(item);
                }

                assert.equal(result.length, 3);
            });

            it("it should be able to iterate when it is removed", async () => {

                let skip = new SkipOperator<ICar>(5),
                    result: Array<ICar> = [];

                skip.remove();
                for await (let item of skip.evaluateAsync(cars())) {
                    result.push(item);
                }

                assert.equal(result.length, 8);
            });


        })
    })
});
