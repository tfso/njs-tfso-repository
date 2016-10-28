import { Operator, OperatorType } from './operator';

export class SkipOperator<TEntity> extends Operator<TEntity> {
    constructor(public count: number) {
        super(OperatorType.Skip);
    }

    public evaluate(items: TEntity[]): TEntity[] {
        return items.slice(this.count);
    }
}