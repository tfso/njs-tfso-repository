import { Operator, OperatorType } from './operator';

export class SelectOperator<TEntity> extends Operator<TEntity> {
    constructor(public selector: (it: TEntity) => {}) {
        super(OperatorType.Select);
    }

    public* evaluate(items: Iterable<TEntity>): IterableIterator<any> {
        let idx = 0;

        for (let item of items) {
            yield this.selector(item)
        }
    }

    public async * evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<any> {
        let idx = 0;

        for await (let item of items) {
            yield this.selector(item)
        }
    }
}