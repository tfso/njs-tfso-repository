import { IArrayExpression } from './interfaces/iarrayexpression';
import { IExpression, Expression } from './expression';
export declare class ArrayExpression extends Expression implements IArrayExpression {
    elements: Array<IExpression>;
    constructor(elements: Array<IExpression>);
    equal(expression: IArrayExpression): boolean;
}
export { IArrayExpression };
