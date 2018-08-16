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

if(!Symbol.asyncIterator)
    (Symbol as any).asyncIterator = Symbol.asyncIterator || "__@@asyncIterator__";


import Repository from './repository/baserepository';

//export { Query } from './repository/db/query';
//export { IRecordSet, RecordSet } from './repository/db/recordset';

export { IRecordSetMeta } from './repository/db/recordset';

export { default as Enumerable, IEnumerable, OperatorType } from './linq/enumerable';
export default Repository;