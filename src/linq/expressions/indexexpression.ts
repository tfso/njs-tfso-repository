import { IExpression, Expression, ExpressionType } from './expression';

export interface IIndexExpression extends IExpression {
    object: IExpression
    index: IExpression
}

export class IndexExpression extends Expression implements IIndexExpression {
    constructor(public object: IExpression, public index: IExpression) {
        super(ExpressionType.Index);
    }

    public equal(expression: IIndexExpression): boolean {
        return this.type == expression.type && this.object.equal(expression.object) && this.index.equal(expression.index);
    }
}