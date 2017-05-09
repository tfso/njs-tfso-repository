import { IExpression, Expression } from './expression';
export interface IIdentifierExpression extends IExpression {
    name: string;
}
export declare class IdentifierExpression extends Expression implements IIdentifierExpression {
    name: string;
    constructor(name: string);
}
