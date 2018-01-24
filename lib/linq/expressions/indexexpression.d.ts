import { IIndexExpression } from './interfaces/iindexexpression';
import { IExpression, Expression } from './expression';
export declare class IndexExpression extends Expression implements IIndexExpression {
    object: IExpression;
    index: IExpression;
    constructor(object: IExpression, index: IExpression);
    equal(expression: IIndexExpression): boolean;
}
export { IIndexExpression };
