import { IExpression } from './expression';
import { IMemberExpression } from './memberexpression';
import { IMethodExpression } from './methodexpression';
import { ReducerVisitor } from './reducervisitor';
export declare class JavascriptVisitor extends ReducerVisitor {
    constructor();
    visitMember(expression: IMemberExpression): IExpression;
    visitMethod(expression: IMethodExpression): IExpression;
    static evaluate(predicate: (it: Object, ...param: Array<any>) => any, it: Object): any;
    static evaluate(expression: IExpression, it: Object): any;
}
