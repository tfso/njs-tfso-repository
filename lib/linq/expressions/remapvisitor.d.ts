import { IExpression } from './expression';
import { IIdentifierExpression } from './identifierexpression';
import { IMemberExpression } from './memberexpression';
import { ILiteralExpression } from './literalexpression';
import { ExpressionVisitor } from './expressionvisitor';
export declare class RemapVisitor extends ExpressionVisitor {
    private remapKey;
    private remapValue;
    constructor(remapKey: (name: string) => string, remapValue: (name: string, value: any) => any);
    visit(expression: IExpression): IExpression;
    visitLiteral(expression: ILiteralExpression): IExpression;
    visitIdentifier(expression: IIdentifierExpression): IExpression;
    visitMember(expression: IMemberExpression): IExpression;
    private findIdentifier;
    private flattenMember;
    private unflattenMember;
}
