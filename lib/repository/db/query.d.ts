import { IRecordSet } from './recordset';
export interface IInputParameters {
    [name: string]: {
        name: string;
        type: any;
        value: any;
    };
}
export declare abstract class Query<TEntity> implements PromiseLike<IRecordSet<TEntity>> {
    protected onFulfilled: (value: IRecordSet<TEntity>) => any | PromiseLike<any>;
    protected onRejected: (error: any) => any | PromiseLike<any>;
    private _parameters;
    private _predicate;
    private _commandText;
    private _hasRun;
    constructor(predicate?: (entity: TEntity) => boolean);
    predicate: (entity: TEntity) => boolean;
    protected abstract input(name: string, value: any): void;
    protected abstract input(name: string, type: any, value: any): void;
    protected commandText: string;
    protected parameters: IInputParameters;
    /**
         * Execute the query with the values provided in parameters and commandText and returns
         * a promise as a IRecordset of TEntity
         * @return A promise of the fulfilled IRecordSet<TEntity>
         */
    protected abstract executeQuery(): Promise<IRecordSet<TEntity>>;
    private execute<U>();
    then<U>(onFulfilled?: (value: IRecordSet<TEntity>) => U | PromiseLike<U>, onRejected?: (error: Error) => U | PromiseLike<U>): Promise<U>;
    catch<U>(onRejected?: (error: Error) => U | PromiseLike<U>): Promise<U>;
}
export { IRecordSet };
