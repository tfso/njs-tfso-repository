export interface IRecordSet<TEntity> extends IRecordSetMeta {
    records: TEntity[]
}

export interface IRecordSetMeta {
    affected: number
    totalLength: number
    length: number
    executionTime: number
}

export class RecordSet<TEntity> implements IRecordSet<TEntity> {
    constructor(records: Array<TEntity>, affected: number) 
    constructor(records: Array<TEntity>, affected: number, executionTime: number) 
    constructor(records: Array<TEntity>, affected: number, executionTime: number, totalLength: number) 
    constructor(public records: Array<TEntity>, public affected: number = 0, public executionTime: number = 0, private _totalLength: number = -1) {

    }

    public get length() {
        return Array.isArray(this.records) ? this.records.length : 0;
    }

    public get totalLength() {
        return this._totalLength == -1 ? this.length : this._totalLength;
    }
}