import { IExpression } from './expression';
import { IMethodExpression } from './methodexpression';
import { ReducerVisitor } from './reducervisitor';
export declare class ODataVisitor extends ReducerVisitor {
    constructor();
    visitOData(filter: string): IExpression;
    readonly it: string;
    visitMethod(expression: IMethodExpression): IExpression;
    static evaluate(expression: string, it?: Object): any;
    static evaluate(expression: IExpression, it?: Object): any;
}
