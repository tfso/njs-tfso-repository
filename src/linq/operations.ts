import { Operator, OperatorType } from './operators/operator';

export class Operations<TEntity> {
    private _stack: Array<Operator<TEntity>>;
    private _removed: Array<Operator<TEntity>>;

    constructor() {
        this._stack = [];
        this._removed = [];
    }

    public add(operator: Operator<TEntity>): void {
        this._stack.push(operator);
    }

    public remove(operator: Operator<TEntity>): boolean {
        var idx = this._stack.indexOf(operator);

        if (idx != -1) {
            this._removed.push(operator);
            operator.remove();

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
            let reset;

            for (let item of this._stack) {
                if (this._removed.indexOf(item) >= 0)
                    continue;

                reset = yield item;
                if (reset === true)
                    break;
            }

            if (reset !== true) // continue while loop if it's resetted
                break;
        }
    }
}