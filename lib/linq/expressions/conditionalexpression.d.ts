import { IExpression, Expression } from './expression';
/**
 * Not in use for now
 */
export interface IConditionalExpression extends IExpression {
    condition: IExpression;
    success: IExpression;
    failure: IExpression;
}
export declare class ConditionalExpression extends Expression implements IConditionalExpression {
    condition: IExpression;
    success: IExpression;
    failure: IExpression;
    constructor(condition: IExpression, success: IExpression, failure: IExpression);
    equal(expression: IConditionalExpression): boolean;
}
