import { IExpression, Expression, ExpressionType } from './expression';

export interface IMemberExpression extends IExpression {
    object: IExpression
    property: IExpression
}

export class MemberExpression extends Expression implements IMemberExpression {
    constructor(public object: IExpression, public property: IExpression) {
        super(ExpressionType.Member);
    }
}