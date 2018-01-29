import { IExpression, ILiteralExpression, IMethodExpression, IBinaryExpression, ILogicalExpression, IConditionalExpression } from './expressionvisitor';
import { ExpressionVisitor } from './expressionvisitor';
export declare class ReducerVisitor extends ExpressionVisitor {
    private _parentExpressionStack;
    private _it;
    constructor();
    readonly it: string;
    visitLambda(predicate: (it: Object, ...param: Array<any>) => any, ...param: Array<any>): IExpression;
    visitLiteral(expression: ILiteralExpression): IExpression;
    visitMethod(expression: IMethodExpression): IExpression;
    visitBinary(expression: IBinaryExpression): IExpression;
    visitConditional(expression: IConditionalExpression): IExpression;
    visitLogical(expression: ILogicalExpression): IExpression;
    evaluate(expression: IExpression, it?: Object): IExpression;
    static evaluate(expression: IExpression, it?: Object): any;
}
