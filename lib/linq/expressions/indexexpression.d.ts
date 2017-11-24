import { IExpression, Expression } from './expression';
export interface IIndexExpression extends IExpression {
    object: IExpression;
    index: IExpression;
}
export declare class IndexExpression extends Expression implements IIndexExpression {
    object: IExpression;
    index: IExpression;
    constructor(object: IExpression, index: IExpression);
    equal(expression: IIndexExpression): boolean;
}
