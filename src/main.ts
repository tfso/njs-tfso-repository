// instead of having "lib: ["esnext.asynciterable"] in tsconfig.json
declare global {
    interface SymbolConstructor {
        /**
         * A method that returns the default async iterator for an object. Called by the semantics of
         * the for-await-of statement.
         */
        readonly asyncIterator: symbol;
    }

    interface AsyncIterator<T> {
        next(value?: any): Promise<IteratorResult<T>>;
        return?(value?: any): Promise<IteratorResult<T>>;
        throw?(e?: any): Promise<IteratorResult<T>>;
    }

    interface AsyncIterable<T> {
        [Symbol.asyncIterator](): AsyncIterator<T>;
    }

    interface AsyncIterableIterator<T> extends AsyncIterator<T> {
        [Symbol.asyncIterator](): AsyncIterableIterator<T>;
    }
}

import Repository from './repository/baserepository';

//export { Query } from './repository/db/query';
//export { IRecordSet, RecordSet } from './repository/db/recordset';

export { default as Enumerable, IEnumerable, OperatorType } from './linq/enumerable';
export default Repository;

import Enumerable, { IEnumerable } from './linq/enumerable';

interface ICar {

    id: number
    location: string

    registrationYear: number

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

var repository = new CarRepository();

var list = repository.exposeFilters(new Enumerable<ICar>().where(car => car.type.make == "Toyota"));

if (list[0].property == 'type.make')
{
}