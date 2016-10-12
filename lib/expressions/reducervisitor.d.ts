import { IExpression } from './expression';
import { IIdentifierExpression } from './identifierexpression';
import { IMemberExpression } from './memberexpression';
import { IBinaryExpression } from './binaryexpression';
import { ILogicalExpression } from './logicalexpression';
import { ExpressionVisitor } from './expressionvisitor';
export declare class ReducerVisitor extends ExpressionVisitor {
    private _params;
    private _isSolvable;
    constructor(...param: Array<any>);
    isSolvable: boolean;
    visitLambda(predicate: (it: Object, ...param: Array<any>) => any, ...param: Array<any>): IExpression;
    visitIdentifier(expression: IIdentifierExpression): IExpression;
    visitMember(expression: IMemberExpression): IExpression;
    visitBinary(expression: IBinaryExpression): IExpression;
    visitLogical(expression: ILogicalExpression): IExpression;
    private evaluate(expression);
}
export { IExpression, Expression, ExpressionType } from './expression';
export { ILiteralExpression, LiteralExpression } from './literalexpression';
export { ICompoundExpression } from './compoundexpression';
export { IIdentifierExpression, IdentifierExpression } from './identifierexpression';
export { IMemberExpression, MemberExpression } from './memberexpression';
export { IMethodExpression, MethodExpression } from './methodexpression';
export { IUnaryExpression, UnaryExpression, UnaryOperatorType, UnaryAffixType } from './unaryexpression';
export { IBinaryExpression, BinaryExpression, BinaryOperatorType } from './binaryexpression';
export { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './logicalexpression';
export { IConditionalExpression } from './conditionalexpression';
export { IArrayExpression, ArrayExpression } from './arrayexpression';
