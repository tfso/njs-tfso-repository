if(!Symbol.asyncIterator)
    (Symbol as any).asyncIterator = Symbol.asyncIterator || "__@@asyncIterator__";


import Repository from './repository/baserepository';

//export { Query } from './repository/db/query';
//export { IRecordSet, RecordSet } from './repository/db/recordset';

export { IRecordSetMeta } from './repository/db/recordset';

export { default as Enumerable, IEnumerable, OperatorType } from './linq/enumerable';
export default Repository;