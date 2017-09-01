import { ILiteralExpression } from './literalexpression';
import { ICompoundExpression } from './compoundexpression';
import { IIdentifierExpression } from './identifierexpression';
import { IMemberExpression } from './memberexpression';
import { IMethodExpression } from './methodexpression';
import { IUnaryExpression } from './unaryexpression';
import { IBinaryExpression } from './binaryexpression';
import { ILogicalExpression } from './logicalexpression';
import { IConditionalExpression } from './conditionalexpression';
import { IArrayExpression } from './arrayexpression';
import { IIndexExpression } from './indexexpression';
import { ITemplateLiteralExpression } from './templateliteralexpression';
import { ExpressionVisitor } from './expressionvisitor';
export declare enum ExpressionType {
    Compound = 0,
    Identifier = 1,
    Member = 2,
    Literal = 3,
    Method = 4,
    Unary = 5,
    Binary = 6,
    Logical = 7,
    Conditional = 8,
    Array = 9,
    Index = 10,
    TemplateLiteral = 11,
}
export interface IExpression {
    type: ExpressionType;
    accept<T extends ExpressionVisitor>(visitor: T): IExpression;
    equal(expression: IExpression): boolean;
}
export declare abstract class Expression implements IExpression {
    private _type;
    constructor(type: ExpressionType);
    type: ExpressionType;
    accept<T extends ExpressionVisitor>(visitor: T): IExpression;
    abstract equal(expression: IExpression): boolean;
}
export { ILiteralExpression, ICompoundExpression, IIdentifierExpression, IMemberExpression, IMethodExpression, IUnaryExpression, IBinaryExpression, ILogicalExpression, IConditionalExpression, IArrayExpression, IIndexExpression, ITemplateLiteralExpression };
