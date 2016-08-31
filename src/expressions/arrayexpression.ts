import { IExpression, Expression, ExpressionType } from './expression';

export interface IArrayExpression extends IExpression {
    elements: Array<IExpression>
}

export class ArrayExpression extends Expression implements IArrayExpression {
    constructor(public elements: Array<IExpression>) {
        super(ExpressionType.Array);
    }
}