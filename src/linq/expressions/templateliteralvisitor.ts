import { IExpression, Expression, ExpressionType } from './expression';
import { ILiteralExpression, LiteralExpression } from './literalexpression';
import { ITemplateLiteralExpression, TemplateLiteralExpression } from './templateliteralexpression';

import { JavascriptVisitor } from './javascriptvisitor';

export class TemplateLiteralVisitor extends JavascriptVisitor {
    private _wrapper: (value: any) => string;

    constructor(wrapper?: (value: any) => string) {
        super();

        this._wrapper = wrapper || ((value: any) => value);
    }

    //public visitTemplateLiteral(expression: ITemplateLiteralExpression): IExpression {
    //    let elements = expression.elements.map((element) => element.accept(this));

    //    if (elements.every(expr => expr.type == ExpressionType.Literal)) 
    //    {
    //        return new LiteralExpression(elements.reduce((output, expr) => {
    //            return output + new String((<ILiteralExpression>expr).value).toString();
    //        }, ''));
    //    }

    //    return new TemplateLiteralExpression(elements);
    //}

    public evaluate(expression: IExpression, it: Object = null): IExpression {
        var value: any = null;

        if (expression == null)
            return null;

        switch (expression.type)
        {
            case ExpressionType.TemplateLiteral:
                if (it)
                {
                    let elements = (<ITemplateLiteralExpression>expression).elements.map(el => this.evaluate(el, it));

                    if (elements.every(el => el.type == ExpressionType.Literal) == true)
                        return new LiteralExpression(elements.reduce((out, el) => out += this._wrapper((<ILiteralExpression>el).value), ''));

                    return new TemplateLiteralExpression(elements);
                }
                break;
                
            default:
                return super.evaluate(expression, it);
        }

        return expression;
    }

    public static evaluate(predicate: (it: Object, ...param: Array<any>) => any, it: Object): any
    public static evaluate(expression: IExpression, it: Object): any
    public static evaluate(expression: IExpression | ((it: Object, ...param: Array<any>) => any), it: Object): any {
        let reducer = new TemplateLiteralVisitor(),
            result: IExpression;

        if (typeof expression == 'function')
            expression = reducer.visitLambda(expression);

        result = reducer.evaluate(expression, it);

        return result.type == ExpressionType.Literal ? (<ILiteralExpression>result).value : undefined;
    }
}