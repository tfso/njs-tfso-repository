import { IBinaryExpression, BinaryOperatorType } from './interfaces/ibinaryexpression';
import { IExpression, Expression } from './expression';
export declare class BinaryExpression extends Expression implements IBinaryExpression {
    operator: BinaryOperatorType;
    left: IExpression;
    right: IExpression;
    constructor(operator: BinaryOperatorType, left: IExpression, right: IExpression);
    equal(expression: IBinaryExpression): boolean;
    toString(): string;
}
export { IBinaryExpression, BinaryOperatorType };
