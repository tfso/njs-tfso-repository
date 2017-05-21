import { Operator, OperatorType } from './operator';

export class TakeOperator<TEntity> extends Operator<TEntity> {
    constructor(public count: number) {
        super(OperatorType.Take);
    }

    public * evaluate(items: Iterable<TEntity>): IterableIterator<TEntity> {
        let idx = 0;

        for (let item of items) {
            if (idx++ == this.count)
                break;

            yield item;
        }
    }
}