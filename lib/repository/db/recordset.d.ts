export interface IRecordSet<TEntity> extends IRecordSetMeta {
    records: TEntity[];
    readonly meta: IRecordSetMeta;
}
export interface IRecordSetMeta {
    affected?: number;
    totalLength?: number;
    length?: number;
    executionTime?: number;
    continuationToken?: any;
}
export declare class RecordSet<TEntity> implements IRecordSet<TEntity> {
    records: Array<TEntity>;
    affected: number;
    executionTime: number;
    private _totalLength;
    continuationToken: any;
    constructor(records: Array<TEntity>, affected: number);
    constructor(records: Array<TEntity>, affected: number, executionTime: number);
    constructor(records: Array<TEntity>, affected: number, executionTime: number, totalLength: number);
    get length(): number;
    get totalLength(): number;
    get meta(): IRecordSetMeta;
}
