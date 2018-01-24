import { IUnaryExpression, UnaryOperatorType, UnaryAffixType } from './interfaces/iunaryexpression';
import { IExpression, Expression } from './expression';
export declare class UnaryExpression extends Expression implements IUnaryExpression {
    operator: UnaryOperatorType;
    affix: UnaryAffixType;
    argument: IExpression;
    constructor(operator: UnaryOperatorType, affix: UnaryAffixType, argument: IExpression);
    equal(expression: IUnaryExpression): boolean;
}
export { IUnaryExpression, UnaryOperatorType, UnaryAffixType };
