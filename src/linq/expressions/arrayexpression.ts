import { IExpression, Expression, ExpressionType } from './expression';

export interface IArrayExpression extends IExpression {
    elements: Array<IExpression>
}

export class ArrayExpression extends Expression implements IArrayExpression {
    constructor(public elements: Array<IExpression>) {
        super(ExpressionType.Array);
    }

    public equal(expression: IArrayExpression): boolean {
        if (this.type == expression.type && this.elements.length == expression.elements.length) {

            for (let i = 0; i < this.elements.length; i++) {
                if (this.elements[i].equal(expression.elements[i]) == false)
                    return false;
            }

            return true;
        }

        return false;
    }
}