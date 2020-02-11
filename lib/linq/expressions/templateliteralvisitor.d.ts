import { IExpression, ExpressionType } from './expression';
import { ITemplateLiteralExpression } from './templateliteralexpression';
import { JavascriptVisitor } from './javascriptvisitor';
export declare class TemplateLiteralVisitor extends JavascriptVisitor {
    private _wrapper;
    constructor(wrapper?: (value: any) => string);
    evaluate(expression: IExpression, it?: Object): IExpression;
    static evaluate(predicate: (it: Object, ...param: Array<any>) => any, it: Object): any;
    static evaluate(expression: IExpression, it: Object): any;
}
export { IExpression, ExpressionType, ITemplateLiteralExpression };
