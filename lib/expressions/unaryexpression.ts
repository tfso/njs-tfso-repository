import { IExpression, Expression, ExpressionType } from './expression';

export enum UnaryAffixType {
    Postfix,
    Prefix
}

export enum UnaryOperatorType {
    Increment,      // ++
    Decrement,      // --
    Invert,         // !
    Negative,       // -
    Positive,       // +
    Complement      // ~
}

export interface IUnaryExpression extends IExpression {
    operator: UnaryOperatorType
    affix: UnaryAffixType
    argument: IExpression
}

export class UnaryExpression extends Expression implements IUnaryExpression {
    constructor(public operator: UnaryOperatorType, public affix: UnaryAffixType, public argument: IExpression) {
        super(ExpressionType.Unary);
    }
}
