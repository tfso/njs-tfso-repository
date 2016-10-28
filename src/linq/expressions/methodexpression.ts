import { IExpression, Expression, ExpressionType } from './expression';

export interface IMethodExpression extends IExpression {
    name: string
    parameters: Array<IExpression>
    caller: IExpression
}

export class MethodExpression extends Expression implements IMethodExpression {
    constructor(public name: string, public parameters: Array<IExpression>, public caller: IExpression) {
        super(ExpressionType.Method);
    }
}