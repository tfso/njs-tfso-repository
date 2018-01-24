import { IExpression } from './interfaces/iexpression';
import { ExpressionType } from './expressiontype';
import { IExpressionVisitor } from './interfaces/iexpressionvisitor';
export declare abstract class Expression implements IExpression {
    private _type;
    constructor(type: ExpressionType);
    type: ExpressionType;
    accept<T extends IExpressionVisitor>(visitor: T): IExpression;
    abstract equal(expression: IExpression): boolean;
}
export { IExpression, ExpressionType };
