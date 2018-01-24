export interface IRecordSet<TEntity> extends IRecordSetMeta {
    records: TEntity[];
    readonly meta: IRecordSetMeta;
}
export interface IRecordSetMeta {
    affected: number;
    totalLength: number;
    length: number;
    executionTime: number;
}
export declare class RecordSet<TEntity> implements IRecordSet<TEntity> {
    records: Array<TEntity>;
    affected: number;
    executionTime: number;
    private _totalLength;
    constructor(records: Array<TEntity>, affected: number);
    constructor(records: Array<TEntity>, affected: number, executionTime: number);
    constructor(records: Array<TEntity>, affected: number, executionTime: number, totalLength: number);
    readonly length: number;
    readonly totalLength: number;
    readonly meta: IRecordSetMeta;
}
