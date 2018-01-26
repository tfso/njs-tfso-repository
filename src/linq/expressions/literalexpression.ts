import { ILiteralExpression } from './interfaces/iliteralexpression';
import { IExpression, Expression, ExpressionType } from './expression';

export class LiteralExpression extends Expression implements ILiteralExpression {
    constructor(public value: any) {
        super(ExpressionType.Literal);
    }

    public equal(expression: ILiteralExpression): boolean {
        return this.type == expression.type && this.value == expression.value;
    }

    public toString() {
        return new String(this.value).toString();
    }
}

export { ILiteralExpression }