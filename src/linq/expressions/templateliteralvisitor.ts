import { IExpression, Expression, ExpressionType } from './expression';
import { ILiteralExpression, LiteralExpression } from './literalexpression';
import { IIdentifierExpression, IdentifierExpression } from './identifierexpression';

import { ITemplateLiteralExpression, TemplateLiteralExpression } from './templateliteralexpression';
import { IObjectExpression, ObjectExpression, IObjectProperty } from './objectexpression';

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
                let elements = (<ITemplateLiteralExpression>expression).elements.map(el => this.evaluate(el, it));

                if (it)
                {
                    if (elements.every(el => el.type == ExpressionType.Literal) == true)
                        return new LiteralExpression(elements.reduce((out, el) => out += this._wrapper((<ILiteralExpression>el).value), ''));
                }

                return new TemplateLiteralExpression(elements);

            case ExpressionType.Object:
                let properties = (<IObjectExpression>expression).properties.map(el => <IObjectProperty>{ key: this.evaluate(el.key, it), value: this.evaluate(el.value, it) });

                if (it)
                {
                    if (properties.every(el => el.value.type == ExpressionType.Literal) == true)
                        return new LiteralExpression(properties.reduce((o, p) => {
                            o[p.key.type == ExpressionType.Identifier ? (<IdentifierExpression>p.key).name : (<ILiteralExpression>p.key).value] = (<ILiteralExpression>p.value).value;
                            return o;
                        }, {}));
                }

                return new ObjectExpression(properties);
                
            default:
                return super.evaluate(expression, it);
        }

        //return expression;
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