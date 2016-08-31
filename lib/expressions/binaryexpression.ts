import { IExpression, Expression, ExpressionType } from './expression';

export enum BinaryOperatorType {
    Subtraction,
    Addition,
    Division,
    Multiplication,

    Modulus,        // %
    And,            // &
    Or,             // |
    ExclusiveOr,    // ^
    LeftShift,      // <<
    RightShift,     // >>
}

export interface IBinaryExpression extends IExpression {
    operator: BinaryOperatorType
    left: IExpression
    right: IExpression
}

export class BinaryExpression extends Expression implements IBinaryExpression {
    constructor(public operator: BinaryOperatorType, public left: IExpression, public right: IExpression) {
        super(ExpressionType.Binary);
    }
}