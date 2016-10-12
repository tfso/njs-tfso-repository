import { IExpression, Expression } from './expression';
export interface IArrayExpression extends IExpression {
    elements: Array<IExpression>;
}
export declare class ArrayExpression extends Expression implements IArrayExpression {
    elements: Array<IExpression>;
    constructor(elements: Array<IExpression>);
}
