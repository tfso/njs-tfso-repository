import { IExpression, Expression, ExpressionType } from './expression';

export interface ICompoundExpression extends IExpression {
    body: Array<IExpression>
}

