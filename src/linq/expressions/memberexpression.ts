import { IExpression, Expression, ExpressionType } from './expression';

export interface IMemberExpression extends IExpression {
    object: IExpression
    property: IExpression
}

export class MemberExpression extends Expression implements IMemberExpression {
    constructor(public object: IExpression, public property: IExpression) {
        super(ExpressionType.Member);
    }

    public equal(expression: IMemberExpression): boolean {
        return this.type == expression.type && this.object.equal(expression.object) && this.property.equal(expression.property);
    }
}