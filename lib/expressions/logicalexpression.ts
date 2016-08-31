import { IExpression, Expression, ExpressionType } from './expression';

export enum LogicalOperatorType {
    And,            // &&
    Or,             // ||
    NotEqual,       // !=
    LesserOrEqual,  // <=
    GreaterOrEqual, // >=
    Lesser,         // <
    Greater,        // >
    Equal           // ==
}

export interface ILogicalExpression extends IExpression {
    operator: LogicalOperatorType
    left: IExpression
    right: IExpression
}

export class LogicalExpression extends Expression implements ILogicalExpression {
    constructor(public operator: LogicalOperatorType, public left: IExpression, public right: IExpression) {
        super(ExpressionType.Logical);
    }
}