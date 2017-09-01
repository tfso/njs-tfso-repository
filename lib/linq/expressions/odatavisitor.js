"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
const literalexpression_1 = require("./literalexpression");
const methodexpression_1 = require("./methodexpression");
const reducervisitor_1 = require("./reducervisitor");
class ODataVisitor extends reducervisitor_1.ReducerVisitor {
    constructor(_it) {
        super();
        this._it = _it;
    }
    visitOData(filter) {
        return super.visitOData(filter);
    }
    get it() {
        return "";
    }
    visitMethod(expression) {
        let parameters = expression.parameters.map((arg) => arg.accept(this)), caller = undefined, name = undefined;
        let params;
        // routine to get all parameters that is a literal, eg; solvable
        let getParams = (expression, ...typeofs) => {
            let params = null, getType = (t) => {
                if (typeof t == 'object') {
                    if (t.getTime && t.getTime() >= 0)
                        return 'date';
                }
                return typeof t;
            };
            try {
                if (parameters.every(expression => expression.type == expression_1.ExpressionType.Literal) == true) {
                    params = parameters.map(expr => expr.value);
                    if (new RegExp('^' + typeofs.map(t => t.endsWith('?') ? '(' + t.slice(0, -1) + ')?' : t).join(';') + ';?$').test(params.map(p => getType(p)).join(';') + ';') == false)
                        throw new TypeError(params.map(p => getType(p)).join(', '));
                }
                else if ((parameters.length == typeofs.length) == false) {
                    throw new Error();
                }
            }
            catch (ex) {
                throw new Error('Method "' + expression.name + '" requires parameters of (' + typeofs.join(', ') + ')' + (ex.name == 'TypeError' ? ', but got "' + ex.message + '"' : ''));
            }
            return params;
        };
        switch (expression.name) {
            // String Functions
            case 'substringof':
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).indexOf(String(params[1])) >= 0);
                break;
            case 'endswith':
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).endsWith(String(params[1])));
                break;
            case 'startswith':
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).startsWith(String(params[1])));
                break;
            case 'length':
                if ((params = getParams(expression, 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).length);
                break;
            case 'indexof':
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).indexOf(String(params[1])));
                break;
            case 'replace':
                if ((params = getParams(expression, 'string', 'string', 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).replace(String(params[1]), String(params[2])));
                break;
            case 'substring':
                if ((params = getParams(expression, 'string', 'number', 'number?')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).replace(String(params[1]), String(params[2])));
                break;
            case 'tolower':
                if ((params = getParams(expression, 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).toLowerCase());
                break;
            case 'toupper':
                if ((params = getParams(expression, 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).toUpperCase());
                break;
            case 'trim':
                if ((params = getParams(expression, 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).trim());
                break;
            case 'concat':
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]) + String(params[1]));
                break;
            // Date Functions
            case 'day':
                if ((params = getParams(expression, 'date')) != null)
                    return new literalexpression_1.LiteralExpression(params[0].getDate());
                break;
            case 'hour':
                if ((params = getParams(expression, 'date')) != null)
                    return new literalexpression_1.LiteralExpression(params[0].getUTCHours());
                break;
            case 'minute':
                if ((params = getParams(expression, 'date')) != null)
                    return new literalexpression_1.LiteralExpression(params[0].getUTCMinutes());
                break;
            case 'month':
                if ((params = getParams(expression, 'date')) != null)
                    return new literalexpression_1.LiteralExpression(params[0].getMonth() + 1);
                break;
            case 'second':
                if ((params = getParams(expression, 'date')) != null)
                    return new literalexpression_1.LiteralExpression(params[0].getSeconds());
                break;
            case 'year':
                if ((params = getParams(expression, 'date')) != null)
                    return new literalexpression_1.LiteralExpression(params[0].getFullYear());
                break;
            // Math Functions
            case 'round':
                if ((params = getParams(expression, 'number')) != null)
                    return new literalexpression_1.LiteralExpression(Math.round(Number(params[0])));
                break;
            case 'floor':
                if ((params = getParams(expression, 'number')) != null)
                    return new literalexpression_1.LiteralExpression(Math.floor(Number(params[0])));
                break;
            case 'ceiling':
                if ((params = getParams(expression, 'number')) != null)
                    return new literalexpression_1.LiteralExpression(Math.ceil(Number(params[0])));
                break;
            // Type Functions
            //case 'isof': // bool IsOf(type p0) | bool IsOf(expression p0, type p1)
            default:
                throw new Error('OData visitor does not support function "' + expression.name + '"');
        }
        return new methodexpression_1.MethodExpression(expression.name, parameters, caller);
    }
    static evaluate(expression, it) {
        let reducer = new ODataVisitor(it), resultExpression = reducer.visit(expression), result = reducer.evaluate(resultExpression);
        return result;
    }
    evaluate(expression, it = null) {
        var value = null;
        if (it == null)
            it = this._it;
        switch (expression.type) {
            case expression_1.ExpressionType.Identifier:
                let identifier = expression;
                if (it != null && it.hasOwnProperty(identifier.name) == true) {
                    value = it[identifier.name];
                }
                break;
            case expression_1.ExpressionType.Member:
                let member = expression, name;
                if (it != null) {
                    if (member.object.type == expression_1.ExpressionType.Identifier && it.hasOwnProperty(name = member.object.name) && typeof it[name] == 'object')
                        value = this.evaluate(member.property, it[name]);
                }
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