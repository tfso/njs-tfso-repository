export declare enum OperatorType {
    Where = 0,
    Take = 1,
    Skip = 2,
    OrderBy = 3,
    Select = 4,
    Join = 5,
    SkipWhile = 6,
    Slice = 7
}
export declare abstract class Operator<TEntity> {
    type: OperatorType;
    protected removed: boolean;
    constructor(type: OperatorType);
    abstract evaluate(...args: any[]): Iterable<TEntity>;
    abstract evaluateAsync(...args: any[]): AsyncIterable<TEntity>;
    remove(): void;
}
