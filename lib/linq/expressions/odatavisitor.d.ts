import { IExpression } from './expression';
import { IMethodExpression } from './methodexpression';
import { ReducerVisitor } from './reducervisitor';
export declare class ODataVisitor extends ReducerVisitor {
    private it;
    constructor(it?: Object);
    visitOData(filter: string): IExpression;
    visitMethod(expression: IMethodExpression): IExpression;
    static evaluate(expression: IExpression, it: Object): any;
    protected evaluate(expression: IExpression): any;
}
