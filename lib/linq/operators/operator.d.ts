export declare enum OperatorType {
    Where = 1,
    Take = 2,
    Skip = 4,
    OrderBy = 8,
}
export declare abstract class Operator<TEntity> {
    type: OperatorType;
    constructor(type: OperatorType);
    abstract evaluate(items: TEntity[]): TEntity[];
}
