import { IConditionalExpression } from './interfaces/iconditionalexpression';
import { IExpression, Expression } from './expression';
/**
 * Not in use for now
 */
export declare class ConditionalExpression extends Expression implements IConditionalExpression {
    condition: IExpression;
    success: IExpression;
    failure: IExpression;
    constructor(condition: IExpression, success: IExpression, failure: IExpression);
    equal(expression: IConditionalExpression): boolean;
}
export { IConditionalExpression };
