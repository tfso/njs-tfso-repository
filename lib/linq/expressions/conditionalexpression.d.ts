import { IExpression } from './expression';
/**
 * Not in use for now
 */
export interface IConditionalExpression extends IExpression {
    condition: IExpression;
    success: IExpression;
    failure: IExpression;
}
