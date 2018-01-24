import { ILiteralExpression } from './interfaces/iliteralexpression';
import { Expression } from './expression';
export declare class LiteralExpression extends Expression implements ILiteralExpression {
    value: any;
    constructor(value: any);
    equal(expression: ILiteralExpression): boolean;
}
export { ILiteralExpression };
