import { IExpression } from './expression';
import { IMethodExpression } from './methodexpression';
import { ReducerVisitor } from './reducervisitor';
export declare class ODataVisitor extends ReducerVisitor {
    private _it;
    constructor(_it?: Object);
    visitOData(filter: string): IExpression;
    readonly it: string;
    visitMethod(expression: IMethodExpression): IExpression;
    static evaluate(expression: IExpression, it: Object): any;
    protected evaluate(expression: IExpression, it?: Object): any;
}
