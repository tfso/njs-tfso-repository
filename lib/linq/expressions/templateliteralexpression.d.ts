import { ITemplateLiteralExpression } from './interfaces/itemplateliteralexpression';
import { IExpression, Expression } from './expression';
export declare class TemplateLiteralExpression extends Expression implements ITemplateLiteralExpression {
    elements: Array<IExpression>;
    constructor(elements: Array<IExpression>);
    equal(expression: ITemplateLiteralExpression): boolean;
}
export { ITemplateLiteralExpression };
