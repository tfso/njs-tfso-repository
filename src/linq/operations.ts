import { Operator, OperatorType } from './operators/operator';

export class Operations<TEntity> {
    private _stack: Array<Operator<TEntity>>;

    constructor() {
        this._stack = [];
    }

    public add(operator: Operator<TEntity>): void {
        this._stack.push(operator);
    }

    public remove(operator: Operator<TEntity>): boolean {
        var idx = this._stack.indexOf(operator);

        if (idx != -1) {
            this._stack.splice(idx, 1);

            return true;
        }

        return false;
    }
    
    public first(): Operator<TEntity>
    public first<T extends Operator<TEntity>>(operator: { new (...args: any[]): T }): T
    public first(operator: { new (...args: any[]): Operator<TEntity> }): Operator<TEntity>
    public first(operatorType: OperatorType): Operator<TEntity> 
    public first(o?: any): Operator<TEntity> {
        if(o == null)
            return this.values().next().value;

        for (let item of this.values())
            if (item.type === o || (typeof o == 'function' && item instanceof o))
                return item;

        return null;
    }

    public* values(): IterableIterator<Operator<TEntity>> {
        while (true) {
            for (let item of this._stack) {
                var reset = yield item;

                if (reset === true)
                    break;
            }

            if (reset !== true) // continue while loop if it's resetted
                break;
        }
    }
}