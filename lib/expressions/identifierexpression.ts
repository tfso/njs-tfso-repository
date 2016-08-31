import { IExpression, Expression, ExpressionType } from './expression';

export interface IIdentifierExpression extends IExpression {
    name: string
}

export class IdentifierExpression extends Expression implements IIdentifierExpression {
    constructor(public name: string) {
        super(ExpressionType.Identifier);
    }
}