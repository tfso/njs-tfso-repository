export enum OperatorType {
    Where = 1,
    Take = 2,
    Skip = 4,
    OrderBy = 8
}

export abstract class Operator<TEntity> {
    constructor(public type: OperatorType) {

    }

    public abstract evaluate(items: Iterable<TEntity>): Iterable<TEntity>;
}