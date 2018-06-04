export enum OperatorType {
    Where,
    Take,
    Skip,
    OrderBy,
    Select,
    Join,
    SkipWhile,
    Slice
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