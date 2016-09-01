import { IExpression, Expression, ExpressionType } from './expression';

export interface IConditionalExpression extends IExpression {
    condition: IExpression
    success: IExpression
    failure: IExpression
}