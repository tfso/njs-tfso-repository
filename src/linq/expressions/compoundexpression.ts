﻿import { IExpression, Expression, ExpressionType } from './expression';

/**
 * Not in use for now
 */
export interface ICompoundExpression extends IExpression {
    body: Array<IExpression>
}

