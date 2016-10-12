import { IExpression, Expression } from './expression';
export interface IMethodExpression extends IExpression {
    name: string;
    parameters: Array<IExpression>;
    caller: IExpression;
}
export declare class MethodExpression extends Expression implements IMethodExpression {
    name: string;
    parameters: Array<IExpression>;
    caller: IExpression;
    constructor(name: string, parameters: Array<IExpression>, caller: IExpression);
}
