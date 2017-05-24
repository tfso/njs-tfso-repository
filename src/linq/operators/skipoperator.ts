import { Operator, OperatorType } from './operator';

export class SkipOperator<TEntity> extends Operator<TEntity> {
    constructor(public count: number) {
        super(OperatorType.Skip);
    }

    public * evaluate(items: Iterable<TEntity>): IterableIterator<TEntity> {
        let idx = 0;

        for (let item of items) {
            if (idx++ < this.count) continue;

            yield item;
        }
    }

    public async * evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<TEntity> {
        let idx = 0;

        for await (let item of items) {
            if (idx++ < this.count) continue;

            yield item;
        }
    }
}