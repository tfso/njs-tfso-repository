import { IExpression, Expression } from './expression';
export interface ITemplateLiteralExpression extends IExpression {
    elements: Array<IExpression>;
}
export declare class TemplateLiteralExpression extends Expression implements ITemplateLiteralExpression {
    elements: Array<IExpression>;
    constructor(elements: Array<IExpression>);
    equal(expression: ITemplateLiteralExpression): boolean;
}
