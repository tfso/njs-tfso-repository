export declare enum OperatorType {
    Where = 1,
    Take = 2,
    Skip = 4,
    OrderBy = 8,
    Select = 16,
    Join = 32,
    SkipWhile = 64,
    Slice = 128,
}
export declare abstract class Operator<TEntity> {
    type: OperatorType;
    protected removed: boolean;
    constructor(type: OperatorType);
    abstract evaluate(...args: any[]): Iterable<TEntity>;
    abstract evaluateAsync(...args: any[]): AsyncIterable<TEntity>;
    remove(): void;
}
