import { IExpression, Expression } from './expression';
export interface IObjectExpression extends IExpression {
    properties: Array<IObjectProperty>;
}
export interface IObjectProperty {
    key: IExpression;
    value: IExpression;
}
export declare class ObjectExpression extends Expression implements IObjectExpression {
    properties: Array<IObjectProperty>;
    constructor(properties: Array<IObjectProperty>);
    equal(expression: IObjectExpression): boolean;
}
