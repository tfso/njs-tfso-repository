import { IExpression } from './expression';
import { IIdentifierExpression } from './identifierexpression';
import { IMemberExpression } from './memberexpression';
import { ExpressionVisitor } from './expressionvisitor';
export declare class RenameVisitor extends ExpressionVisitor {
    private renames;
    constructor(...renames: Array<{
        from: string;
        to: string;
    }>);
    visit(expression: IExpression): IExpression;
    visitIdentifier(expression: IIdentifierExpression): IExpression;
    visitMember(expression: IMemberExpression): IExpression;
    private flattenMember(expression);
    private unflattenMember(path, idx?);
}
