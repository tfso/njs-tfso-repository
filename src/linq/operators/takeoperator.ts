﻿import { Operator, OperatorType } from './operator';

export class TakeOperator<TEntity> extends Operator<TEntity> {
    constructor(public count: number) {
        super(OperatorType.Take);
    }

    public * evaluate(items: Iterable<TEntity>): IterableIterator<TEntity> {
        let idx = 0;

        for (let item of items) {
            if (idx++ == this.count && this.removed == false)
                break;

            yield item;

            if (idx == this.count && this.removed == false)
                break;
        }
    }

    public async * evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<TEntity> {
        let idx = 0;
        
        for await (let item of items) {
            if (idx++ == this.count && this.removed == false)
                break;

            yield item;

            if (idx == this.count && this.removed == false)
                break;
        }
    }
}