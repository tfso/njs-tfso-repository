import { IRecordSet } from './recordset';
import Enumerable, { IEnumerable } from './../../linq/enumerable';
import { WhereOperator } from './../../linq/operators/whereoperator';

export interface IInputParameters {
    [name: string]: {
        name: string
        type: any
        value: any
    }
}

export abstract class Query<TEntity> implements PromiseLike<IRecordSet<TEntity>> {

    //protected onFulfilled: (value: IRecordSet<TEntity>) => any | PromiseLike<any>;
    //protected onRejected: (error: any) => any | PromiseLike<any>;


    private _parameters: IInputParameters = {};
    private _predicate: (entity: TEntity) => boolean;
    private _predicateFootprint: string;

    private _query: IEnumerable<TEntity>; 
    private _maxExecutionTime: number = 5000;
    private _commandText: string;
    private _hasRun: boolean;

    private _promise: Promise<IRecordSet<TEntity>>;

    constructor(maxExecutionTime?: number)
    constructor(query?: IEnumerable<TEntity>, maxExecutionTime?: number)
    constructor()
    {
        switch (arguments.length) {
            case 1:
                if (typeof arguments[1] == 'object')
                    this.query = arguments[0];
                else
                    this._maxExecutionTime = Number(arguments[0]) || 5000;

                break;

            case 2:
                this.query = arguments[0];
                this._maxExecutionTime = Number(arguments[1]);
                break;
        }

        this._hasRun = false;
    }

    public get query(): IEnumerable<TEntity> {
        if (this._query == null)
            this._query = new Enumerable<TEntity>();

        return this._query;
    }

    public set query(value: IEnumerable<TEntity>) {
        this._query = value;

        if (value != null) {
            for (let operator of value.operations.values())
                if (operator instanceof WhereOperator) {
                    this._predicateFootprint = operator.toString();

                    break;
                }
        }
    }

    protected abstract input(name: string, value: any): void
    protected abstract input(name: string, type: any, value: any): void

    protected set commandText(query: string) {
        if (this._promise)
            throw new Error('Query promise is executed, impossible to change commandText');

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

    private execute<U, V>(onFulfilled?: (value: IRecordSet<TEntity>) => U | PromiseLike<U>, onRejected?: (error: Error) => V | PromiseLike<V>): Promise<U | V> {
        var stamped = Date.now();

        if (!this._promise) {
            this._promise = this.executeQuery()
                .then((recordset) => {
                    if (recordset.executionTime > this._maxExecutionTime || (recordset.executionTime == 0 && (Date.now() - stamped) > this._maxExecutionTime))
                        console.warn(`[WARNING]: Long running query (${(recordset.executionTime > 0 ? recordset.executionTime : Date.now() - stamped)}ms). Consider narrow down the result length (${recordset.length}pcs)${this._predicateFootprint && this._predicateFootprint.length > 0 ? " for predicate " + this._predicateFootprint : ""};\n    ${this.commandText}`);

                    return recordset;
                });
        }

        return this._promise
            .then(onFulfilled, onRejected);
    }

    public then<U, V>(onFulfilled?: (value: IRecordSet<TEntity>) => U | PromiseLike<U>, onRejected?: (error: Error) => V | PromiseLike<V>): Promise<U | V> {
        return this.execute<U, V>(onFulfilled, onRejected);
    }

    public catch<U>(onRejected?: (error: Error) => U | PromiseLike<U>): Promise<U> {
        return this.execute<never, U>(undefined, onRejected);
    }
}

export { IRecordSet }