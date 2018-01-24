export interface IRecordSet<TEntity> extends IRecordSetMeta {
    records: TEntity[]

    readonly meta: IRecordSetMeta;
}

export interface IRecordSetMeta {
    affected: number
    totalLength: number
    length: number
    executionTime: number
    continuationToken: any
}

export class RecordSet<TEntity> implements IRecordSet<TEntity> {
    constructor(records: Array<TEntity>, affected: number) 
    constructor(records: Array<TEntity>, affected: number, executionTime: number) 
    constructor(records: Array<TEntity>, affected: number, executionTime: number, totalLength: number) 
    constructor(public records: Array<TEntity>, public affected: number = 0, public executionTime: number = 0, private _totalLength: number = -1, public continuationToken: any = null) {

    }

    public get length() {
        return Array.isArray(this.records) ? this.records.length : 0;
    }

    public get totalLength() {
        return this._totalLength == -1 ? this.length : this._totalLength;
    }

    public get meta(): IRecordSetMeta {
        return <IRecordSetMeta>{
            affected: this.affected,
            totalLength: this.totalLength,
            length: this.length,
            executionTime: this.executionTime
        }
    }
}