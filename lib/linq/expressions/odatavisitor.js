"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
const literalexpression_1 = require("./literalexpression");
const methodexpression_1 = require("./methodexpression");
const reducervisitor_1 = require("./reducervisitor");
class ODataVisitor extends reducervisitor_1.ReducerVisitor {
    constructor(it) {
        super();
        this.it = it;
    }
    visitOData(filter) {
        return super.visitOData(filter);
    }
    visitMethod(expression) {
        let parameters = expression.parameters.map((arg) => arg.accept(this)), caller = null;
        if (parameters.every(expression => expression.type == expression_1.ExpressionType.Literal) == true) {
            // all parameters is a literal, eg; solvable
            let params = parameters.map(expr => expr.value);
            switch (expression.name) {
                // String Functions
                case 'substringof':
                    if ((params.length == 2 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "substringof" requires parameters of (string, string), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(String(params[0]).indexOf(String(params[1])) >= 0);
                case 'endswith':
                    if ((params.length == 2 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "endswith" requires parameters of (string, string), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(String(params[0]).endsWith(String(params[1])));
                case 'startswith':
                    if ((params.length == 2 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "startswith" requires parameters of (string, string), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(String(params[0]).startsWith(String(params[1])));
                case 'length':
                    if ((params.length == 1 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "length" requires parameters of (string), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(String(params[0]).length);
                case 'indexof':
                    if ((params.length == 2 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "indexof" requires parameters of (string, string), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(String(params[0]).indexOf(String(params[1])));
                case 'replace':
                    if ((params.length == 3 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "replace" requires parameters of (string, string, string), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(String(params[0]).replace(String(params[1]), String(params[2])));
                case 'substring':
                    if ((params.length >= 2 && typeof params[0] == "string" && typeof params[1] == 'number' && (params.length == 3 ? typeof params[3] == 'number' : true)) == false)
                        throw new Error('Method "replace" requires parameters of (string, int, int?), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(String(params[0]).replace(String(params[1]), String(params[2])));
                case 'tolower':
                    if ((params.length == 1 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "tolower" requires parameters of (string), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(String(params[0]).toLowerCase());
                case 'toupper':
                    if ((params.length == 1 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "toupper" requires parameters of (string), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(String(params[0]).toUpperCase());
                case 'trim':
                    if ((params.length == 1 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "trim" requires parameters of (string), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(String(params[0]).trim());
                case 'concat':
                    if ((params.length == 2 && params.every(p => typeof p == 'string')) == false)
                        throw new Error('Method "concat" requires parameters of (string, string), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(String(params[0]) + String(params[1]));
                // Date Functions
                case 'day': // int day(DateTime p0)
                case 'hour': // int hour(DateTime p0)
                case 'minute': // int minute(DateTime p0)
                case 'month': // int month(DateTime p0)
                case 'second': // int second(DateTime p0)
                case 'year':
                    throw new Error('OData visitor does not support Date Functions at this time');
                // Math Functions
                case 'round':
                    if ((params.length == 1 && params.every(p => typeof p == 'number')) == false)
                        throw new Error('Method "round" requires parameters of (number), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(Math.round(Number(params[0])));
                case 'floor':
                    if ((params.length == 1 && params.every(p => typeof p == 'number')) == false)
                        throw new Error('Method "floor" requires parameters of (number), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(Math.floor(Number(params[0])));
                case 'ceiling':
                    if ((params.length == 1 && params.every(p => typeof p == 'number')) == false)
                        throw new Error('Method "ceiling" requires parameters of (number), but got "' + params.map(p => typeof p).join(', ') + '"');
                    return new literalexpression_1.LiteralExpression(Math.ceil(Number(params[0])));
                // Type Functions
                case 'isof': // bool IsOf(type p0) | bool IsOf(expression p0, type p1)
                default:
                    throw new Error('OData visitor does not support function "' + expression.name + '"');
            }
        }
        return new methodexpression_1.MethodExpression(expression.name, parameters, caller);
    }
    static evaluate(expression, it) {
        let reducer = new ODataVisitor(it), resultExpression = reducer.visit(expression), result = reducer.evaluate(resultExpression);
        return result;
    }
    evaluate(expression) {
        var value = null;
        switch (expression.type) {
            case expression_1.ExpressionType.Identifier:
                let identifier = expression;
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
exports.ODataVisitor = ODataVisitor;
//# sourceMappingURL=odatavisitor.js.map