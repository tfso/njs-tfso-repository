export interface IRecordSet<TEntity> {
    affected: number;
    length: number;
    executionTime: number;
    records: TEntity[];
}
export declare class RecordSet<TEntity> implements IRecordSet<TEntity> {
    records: Array<TEntity>;
    affected: number;
    executionTime: number;
    constructor(records: Array<TEntity>, affected?: number, executionTime?: number);
    length: number;
}
