import { IExpression } from './iexpression';
export interface ITemplateLiteralExpression extends IExpression {
    elements: Array<IExpression>;
}
