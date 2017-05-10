import { IExpression, Expression, ExpressionType } from './expression';
import { ILiteralExpression, LiteralExpression } from './literalexpression';
import { ICompoundExpression } from './compoundexpression';
import { IIdentifierExpression, IdentifierExpression } from './identifierexpression';
import { IMemberExpression, MemberExpression } from './memberexpression';
import { IMethodExpression, MethodExpression } from './methodexpression';
import { IUnaryExpression, UnaryExpression, UnaryOperatorType, UnaryAffixType } from './unaryexpression';
import { IBinaryExpression, BinaryExpression, BinaryOperatorType } from './binaryexpression';
import { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './logicalexpression';
import { IConditionalExpression } from './conditionalexpression';
import { IArrayExpression, ArrayExpression } from './arrayexpression';

import { LambdaExpression } from './lambdaexpression';
import { ReducerVisitor } from './reducervisitor';

export class ODataVisitor extends ReducerVisitor {
    constructor(private it?: Object) {
        super();
    }
    
    public visitOData(filter: string): IExpression {
        return super.visitOData(filter);
    }

    public visitMethod(expression: IMethodExpression): IExpression {
        let parameters = expression.parameters.map((arg) => arg.accept(this)),
            caller = null;

        if (parameters.every(expression => expression.type == ExpressionType.Literal) == true) {
            // all parameters is a literal, eg; solvable
            let params: Array<any> = parameters.map(expr => (<LiteralExpression>expr).value);

            switch (expression.name) {
                // String Functions
                case 'substringof': // bool substringof(string po, string p1)
                    if ((params.length == 2 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "substringof" requires parameters of (string, string), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression(String(params[0]).indexOf(String(params[1])) >= 0);

                case 'endswith': // bool endswith(string p0, string p1)
                    if ((params.length == 2 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "endswith" requires parameters of (string, string), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression(String(params[0]).endsWith(String(params[1])));

                case 'startswith': // bool startswith(string p0, string p1)
                    if ((params.length == 2 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "startswith" requires parameters of (string, string), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression(String(params[0]).startsWith(String(params[1])));

                case 'length': // int length(string p0)
                    if ((params.length == 1 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "length" requires parameters of (string), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression(String(params[0]).length);

                case 'indexof': // int indexof(string p0, string p1)
                    if ((params.length == 2 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "indexof" requires parameters of (string, string), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression(String(params[0]).indexOf(String(params[1])));

                case 'replace': // string replace(string p0, string find, string replace)
                    if ((params.length == 3 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "replace" requires parameters of (string, string, string), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression(String(params[0]).replace(String(params[1]), String(params[2])));

                case 'substring': // string substring(string p0, int pos, int? length)
                    if ((params.length >= 2 && typeof params[0] == "string" && typeof params[1] == 'number' && (params.length == 3 ? typeof params[3] == 'number' : true)) == false)
                        throw new Error('Method "replace" requires parameters of (string, int, int?), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression(String(params[0]).replace(String(params[1]), String(params[2])));
                    
                case 'tolower': // string tolower(string p0)
                    if ((params.length == 1 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "tolower" requires parameters of (string), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression(String(params[0]).toLowerCase());

                case 'toupper': // string toupper(string p0)
                    if ((params.length == 1 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "toupper" requires parameters of (string), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression(String(params[0]).toUpperCase());

                case 'trim': // string trim(string p0)
                    if ((params.length == 1 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "trim" requires parameters of (string), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression(String(params[0]).trim());

                case 'concat': // string concat(string p0, string p1)
                    if ((params.length == 2 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "concat" requires parameters of (string, string), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression(String(params[0]) + String(params[1]));

                // Date Functions
                case 'day': // int day(DateTime p0)
                    if ((params.length == 1 && typeof params[0] == 'object' && params[0].getTime() > 0) == false)
                        throw new Error('Method "year" requires parameter of (Date), but got "' + typeof params[0] + '"');

                    return new LiteralExpression((<Date>params[0]).getDate());
                        
                case 'hour': // int hour(DateTime p0)
                    if ((params.length == 1 && typeof params[0] == 'object' && params[0].getTime() > 0) == false)
                        throw new Error('Method "year" requires parameter of (Date), but got "' + typeof params[0] + '"');

                    return new LiteralExpression((<Date>params[0]).getUTCHours());

                case 'minute': // int minute(DateTime p0)
                    if ((params.length == 1 && typeof params[0] == 'object' && params[0].getTime() > 0) == false)
                        throw new Error('Method "year" requires parameter of (Date), but got "' + typeof params[0] + '"');

                    return new LiteralExpression((<Date>params[0]).getUTCMinutes());

                case 'month': // int month(DateTime p0)
                    if ((params.length == 1 && typeof params[0] == 'object' && params[0].getTime() > 0) == false)
                        throw new Error('Method "year" requires parameter of (Date), but got "' + typeof params[0] + '"');

                    return new LiteralExpression((<Date>params[0]).getMonth() + 1);

                case 'second': // int second(DateTime p0)
                    if ((params.length == 1 && typeof params[0] == 'object' && params[0].getTime() > 0) == false)
                        throw new Error('Method "year" requires parameter of (Date), but got "' + typeof params[0] + '"');

                    return new LiteralExpression((<Date>params[0]).getSeconds());

                case 'year': // int year(DateTime p0)
                    if ((params.length == 1 && typeof params[0] == 'object' && params[0].getTime() > 0) == false)
                        throw new Error('Method "year" requires parameter of (Date), but got "' + typeof params[0] + '"');

                    return new LiteralExpression((<Date>params[0]).getFullYear());

                // Math Functions
                case 'round': // number round(number p0)
                    if ( (params.length == 1 && params.every(p => typeof p == 'number')) == false)
                        throw new Error('Method "round" requires parameters of (number), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression( Math.round( Number(params[0]) ));

                case 'floor': // number floor(number p0)
                    if ((params.length == 1 && params.every(p => typeof p == 'number')) == false)
                        throw new Error('Method "floor" requires parameters of (number), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression(Math.floor(Number(params[0])));

                case 'ceiling': // number ceiling(number p0)
                    if ((params.length == 1 && params.every(p => typeof p == 'number')) == false)
                        throw new Error('Method "ceiling" requires parameters of (number), but got "' + params.map(p => typeof p).join(', ') + '"');

                    return new LiteralExpression(Math.ceil(Number(params[0])));

                // Type Functions
                case 'isof': // bool IsOf(type p0) | bool IsOf(expression p0, type p1)

                default:
                    throw new Error('OData visitor does not support function "' + expression.name + '"');
            }
        }

        return new MethodExpression(expression.name, parameters, caller);
    }

    public static evaluate(expression: IExpression, it: Object): any {
        let reducer = new ODataVisitor(it),
            resultExpression = reducer.visit(expression),
            result = reducer.evaluate(resultExpression);

        return result;
    }

    protected evaluate(expression: IExpression): any {
        var value: any = null;

        switch (expression.type) {
            case ExpressionType.Identifier:
                let identifier = (<IIdentifierExpression>expression);

                if (this.it != null && this.it.hasOwnProperty(identifier.name) == true)
                    return this.it[identifier.name];

                break;

            default:
                value = super.evaluate(expression);
                break;
        }

        return value;
    }
}