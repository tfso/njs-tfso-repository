import { IRecordSet } from './recordset';
import { IEnumerable } from './../../linq/enumerable';
export interface IInputParameters {
    [name: string]: {
        name: string;
        type: any;
        value: any;
    };
}
export declare abstract class Query<TEntity> implements PromiseLike<IRecordSet<TEntity>> {
    private _parameters;
    private _predicate;
    private _predicateFootprint;
    private _query;
    private _maxExecutionTime;
    private _commandText;
    private _hasRun;
    private _promise;
    constructor(maxExecutionTime?: number);
    constructor(query?: IEnumerable<TEntity>, maxExecutionTime?: number);
    get query(): IEnumerable<TEntity>;
    set query(value: IEnumerable<TEntity>);
    protected abstract input(name: string, value: any): void;
    protected abstract input(name: string, type: any, value: any): void;
    protected set commandText(query: string);
    protected get commandText(): string;
    protected get parameters(): IInputParameters;
    /**
         * Execute the query with the values provided in parameters and commandText and returns
         * a promise as a IRecordset of TEntity
         * @return A promise of the fulfilled IRecordSet<TEntity>
         */
    protected abstract executeQuery(): Promise<IRecordSet<TEntity>>;
    private execute;
    then<U, V>(onFulfilled?: (value: IRecordSet<TEntity>) => U | PromiseLike<U>, onRejected?: (error: Error) => V | PromiseLike<V>): Promise<U | V>;
    catch<U>(onRejected?: (error: Error) => U | PromiseLike<U>): Promise<U>;
}
export { IRecordSet };
