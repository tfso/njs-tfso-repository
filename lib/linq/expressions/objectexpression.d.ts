import { IObjectExpression, IObjectProperty } from './interfaces/iobjectexpression';
import { Expression } from './expression';
export declare class ObjectExpression extends Expression implements IObjectExpression {
    properties: Array<IObjectProperty>;
    constructor(properties: Array<IObjectProperty>);
    equal(expression: IObjectExpression): boolean;
}
export { IObjectExpression, IObjectProperty };
