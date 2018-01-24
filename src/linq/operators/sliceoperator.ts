import { Operator, OperatorType } from './operator';

export class SliceOperator<TEntity> extends Operator<TEntity> {
    constructor(public begin: number | any, public end: number) {
        super(OperatorType.Skip);
    }

    public * evaluate(items: Iterable<TEntity>): IterableIterator<TEntity> {
        let idx = -1;

        for (let item of items) {
            idx++;

            if(this.removed == false) {
                if ( typeof this.begin == 'number' && idx < this.begin ) continue;
                if ( typeof this.end == 'number' && idx >= this.end) continue;
            }

            yield item;
        }
    }

    public async * evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<TEntity> {
        let idx = 0;

        for await (let item of items) {
            idx++;

            if(this.removed == false) {
                if ( typeof this.begin == 'number' && idx < this.begin ) continue;
                if ( typeof this.end == 'number' && idx >= this.end) continue;
            }

            yield item;
        }
    }
}