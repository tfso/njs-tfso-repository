import { IExpression, Expression, ExpressionType } from './expression';
import { ILiteralExpression, LiteralExpression } from './literalexpression';
import { ITemplateLiteralExpression, TemplateLiteralExpression } from './templateliteralexpression';

import { JavascriptVisitor } from './javascriptvisitor';

export class TemplateLiteralVisitor extends JavascriptVisitor {
    constructor(it?: Object, private wrapper?: (value: any) => string) {
        super(it);
    }

    public visitTemplateLiteral(expression: ITemplateLiteralExpression): IExpression {
        let elements = expression.elements.map((element) => element.accept(this));

        if (elements.every(expr => expr.type == ExpressionType.Literal)) 
        {
            return new LiteralExpression(elements.reduce((output, expr) => {
                return output + new String((<ILiteralExpression>expr).value).toString();
            }, ''));
        }

        return new TemplateLiteralExpression(elements);
    }

    public evaluate(expression: IExpression, it: Object = null): any {
        var value: any = null;

        switch (expression.type)
        {

            case ExpressionType.TemplateLiteral:
                value = (<ITemplateLiteralExpression>expression).elements.map(el => this.evaluate(el, it)).reduce((output, value) => {
                    return output + new String(value).toString();
                }, '');
                
                break;

            default:
                value = super.evaluate(expression, it);
        }

        return value;
    }

    public static evaluate(expression: IExpression, it: Object): any {
        let templateparser = new TemplateLiteralVisitor(it),
            resultExpression = templateparser.visit(expression),
            result = templateparser.evaluate(resultExpression);

        return result;
    }
}