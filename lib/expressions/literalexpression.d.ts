import { IExpression, Expression } from './expression';
export interface ILiteralExpression extends IExpression {
    value: any;
}
export declare class LiteralExpression extends Expression implements ILiteralExpression {
    value: any;
    constructor(value: any);
}
