import { IRecordSet } from './recordset';

export interface IInputParameters {
    [name: string]: {
        name: string
        type: any
        value: any
    }
}

export abstract class Query<TEntity> implements PromiseLike<IRecordSet<TEntity>> {

    protected onFulfilled: (value: IRecordSet<TEntity>) => any | PromiseLike<any>;
    protected onRejected: (error: any) => any | PromiseLike<any>;

    private _parameters: IInputParameters = {};
    private _predicate: (entity: TEntity) => boolean;
    private _commandText: string;
    private _hasRun: boolean;

    constructor(predicate?: (entity: TEntity) => boolean) {
        this._predicate = predicate;
        this._hasRun = false;
    }

    public set predicate(value: (entity: TEntity) => boolean) {
        this._predicate = value;
    }

    public get predicate(): (entity: TEntity) => boolean {
        if (this._predicate == null)
            return (entity) => true;

        return this._predicate;
    }

    protected abstract input(name: string, value: any): void
    protected abstract input(name: string, type: any, value: any): void

    protected set commandText(query: string) {
        this._commandText = query;
    }

    protected get commandText(): string {
        return this._commandText;
    }

    protected get parameters(): IInputParameters {
        return this._parameters;
    }
    /**
         * Execute the query with the values provided in parameters and commandText and returns
         * a promise as a IRecordset of TEntity
         * @return A promise of the fulfilled IRecordSet<TEntity>
         */
    protected abstract executeQuery(): Promise<IRecordSet<TEntity>>

    private execute<U>(): Promise<U> {
        var stamped = Date.now();

        return this.executeQuery()
            .then((recordset) => {
                if (recordset.executionTime > 1000 || (recordset.executionTime == 0 && (Date.now() - stamped) > 1000))
                    console.warn(`[WARNING]: Long running query (${(recordset.executionTime > 0 ? recordset.executionTime : Date.now() - stamped)}ms). Consider narrow down the result length (${recordset.length}pcs);\n   ${this.commandText}`);

                if (!this.onFulfilled)
                    return Promise.resolve(recordset);

                return this.onFulfilled(recordset);
            }, (err) => {
                if (!this.onRejected)
                    return Promise.reject(err);

                return this.onRejected(err);
            })
    }

    public then<U>(onFulfilled?: (value: IRecordSet<TEntity>) => U | PromiseLike<U>, onRejected?: (error: Error) => U | PromiseLike<U>): Promise<U> {
        if (this._hasRun == true)
            throw new Error('Query is not thread safe currently, please dispose Query after use');

        this._hasRun = true;

        this.onFulfilled = onFulfilled;
        this.onRejected = onRejected;

        return this.execute<U>();
    }

    public catch<U>(onRejected?: (error: Error) => U | PromiseLike<U>): Promise<U> {
        if (this._hasRun == true)
            throw new Error('Query is not thread safe currently, please dispose Query after use');

        this.onRejected = onRejected;

        return this.execute<U>()
    }
}

export { IRecordSet }