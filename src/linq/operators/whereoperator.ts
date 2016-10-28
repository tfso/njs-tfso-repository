import { Operator, OperatorType } from './operator';

export class WhereOperator<TEntity> extends Operator<TEntity> {
    private _parameters: Array<any>;

    constructor(public predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[]) {
        super(OperatorType.Where);

        this._parameters = parameters;
    }

    public get parameters(): any[] {
        return this._parameters;
    }

    public evaluate(items: TEntity[]): TEntity[] {
        return items.filter(entity => {
            return this.predicate.apply({}, [entity].concat(this.parameters));
        })
    }
}