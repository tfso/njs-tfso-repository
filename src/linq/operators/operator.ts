export enum OperatorType {
    Where       = 1 << 0,
    Take        = 1 << 1,
    Skip        = 1 << 2,
    OrderBy     = 1 << 3,
    Select      = 1 << 4,
    Join        = 1 << 5,
    SkipWhile   = 1 << 6,
    Slice       = 1 << 7
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