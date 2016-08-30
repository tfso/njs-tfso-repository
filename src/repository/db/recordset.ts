export interface IRecordSet<TEntity> {
    affected: number
    length: number
    executionTime: number
    records: TEntity[]
}

export class RecordSet<TEntity> implements IRecordSet<TEntity> {
    constructor(public records: Array<TEntity>, public affected: number = 0, public executionTime: number = 0) {

    }

    public get length() {
        return Array.isArray(this.records) ? this.records.length : 0;
    }
}