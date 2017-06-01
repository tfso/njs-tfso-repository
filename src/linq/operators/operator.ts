export enum OperatorType {
    Where = 1,
    Take = 2,
    Skip = 4,
    OrderBy = 8,
    Select = 16,
    Join = 32
}

export abstract class Operator<TEntity> {
    protected removed: boolean = false;

    constructor(public type: OperatorType) {

    }
    
    public abstract evaluate(...args: any[]): Iterable<TEntity>;
    public abstract evaluateAsync(...args: any[]): AsyncIterable<TEntity>;

    public remove() {
        this.removed = true;
    }
}