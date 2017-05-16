import { IExpression, Expression, ExpressionType } from './expression';

export interface ILiteralExpression extends IExpression {
    value: any
}

export class LiteralExpression extends Expression implements ILiteralExpression {
    constructor(public value: any) {
        super(ExpressionType.Literal);
    }

    public equal(expression: ILiteralExpression): boolean {
        return this.type == expression.type && this.value == expression.value;
    }
}