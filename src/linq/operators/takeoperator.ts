import { Operator, OperatorType } from './operator';

export class TakeOperator<TEntity> extends Operator<TEntity> {
    constructor(public count: number) {
        super(OperatorType.Take);
    }

    public evaluate(items: TEntity[]): TEntity[] {
        return items.slice(0, this.count);
    }
}