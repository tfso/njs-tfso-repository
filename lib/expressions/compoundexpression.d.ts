import { IExpression } from './expression';
export interface ICompoundExpression extends IExpression {
    body: Array<IExpression>;
}
