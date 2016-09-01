import { IExpression, Expression } from './expression';
export interface IMemberExpression extends IExpression {
    object: IExpression;
    property: IExpression;
}
export declare class MemberExpression extends Expression implements IMemberExpression {
    object: IExpression;
    property: IExpression;
    constructor(object: IExpression, property: IExpression);
}
