"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsep = require("jsep");
const OData = require("odata-parser");
const expression_1 = require("./expression");
const literalexpression_1 = require("./literalexpression");
const identifierexpression_1 = require("./identifierexpression");
const memberexpression_1 = require("./memberexpression");
const methodexpression_1 = require("./methodexpression");
const unaryexpression_1 = require("./unaryexpression");
const binaryexpression_1 = require("./binaryexpression");
const logicalexpression_1 = require("./logicalexpression");
const arrayexpression_1 = require("./arrayexpression");
const lambdaexpression_1 = require("./lambdaexpression");
class ExpressionStack {
    constructor() {
        this.items = [];
        this.count = 0;
    }
    length() {
        return this.count;
    }
    push(item) {
        this.items.push(item);
        this.count = this.count + 1;
    }
    pop() {
        if (this.count > 0) {
            this.count = this.count - 1;
        }
        return this.items.pop();
    }
    peek() {
        if (this.count <= 1)
            return null;
        return this.items[this.count - 2]; // current object is always last
    }
}
exports.ExpressionStack = ExpressionStack;
class ExpressionVisitor {
    constructor() {
        this._expressionStack = new ExpressionStack();
    }
    get stack() {
        return this._expressionStack;
    }
    visitOData(filter) {
        let ast = OData.parse((filter.indexOf('$filter=') == -1 ? '$filter=' : '') + filter);
        if (ast.error)
            throw new Error(ast.error);
        try {
            if (ast.$filter) {
                return this.visit(this.transformOData(ast.$filter));
            }
        }
        catch (ex) {
            throw new Error(ex.message);
        }
        return null;
    }
    visitLambda(predicate) {
        var expression = (this._lambdaExpression = new lambdaexpression_1.LambdaExpression(predicate)).expression;
        if (expression) {
            try {
                return this.visit(this.transform(jsep(expression)));
            }
            catch (ex) {
                throw new Error(ex.message);
            }
        }
        return null;
    }
    visit(expression) {
        return expression.accept(this);
    }
    visitLiteral(expression) {
        switch (typeof expression.value) {
            case 'string':
                break;
            case 'number':
                break;
        }
        return expression;
    }
    visitArray(expression) {
        expression.elements = expression.elements.map((element) => element.accept(this));
        return expression;
    }
    visitCompound(expression) {
        expression.body = expression.body.map((expr) => expr.accept(this));
        return expression;
    }
    visitIdentifier(expression) {
        return expression;
    }
    visitBinary(expression) {
        expression.left = expression.left.accept(this);
        expression.right = expression.right.accept(this);
        return expression;
    }
    visitMethod(expression) {
        if (expression.caller)
            expression.caller = expression.caller.accept(this);
        expression.parameters = expression.parameters.map((arg) => arg.accept(this));
        return expression;
    }
    visitUnary(expression) {
        expression.argument = expression.argument.accept(this);
        return expression;
    }
    visitMember(expression) {
        expression.object = expression.object.accept(this);
        expression.property = expression.property.accept(this);
        return expression;
    }
    visitLogical(expression) {
        expression.left = expression.left.accept(this);
        expression.right = expression.right.accept(this);
        return expression;
    }
    visitConditional(expression) {
        expression.condition = expression.condition.accept(this);
        expression.success = expression.success.accept(this);
        expression.failure = expression.failure.accept(this);
        return expression;
    }
    /**
     * transform odata expression ast tree to our internal ast tree to make it easier to swap expression parser at a later time
     * @see
     * http://www.odata.org/documentation/odata-version-2-0/uri-conventions/
     * https://github.com/auth0/node-odata-parser/blob/master/src/odata.pegjs
     *
     * @param filter odata filter, eg; Name eq 'John' and LastName lt 'Doe'
     */
    transformOData(expression) {
        var child;
        switch (expression.type) {
            case 'property':
                let identifiers = new String(expression.name).split('/');
                let getProperty = (identifiers, idx) => {
                    if (idx + 1 >= identifiers.length)
                        return new identifierexpression_1.IdentifierExpression(identifiers[idx]);
                    return new memberexpression_1.MemberExpression(new identifierexpression_1.IdentifierExpression(identifiers[idx]), getProperty(identifiers, idx + 1));
                };
                let ret = getProperty(identifiers, 0);
                return ret;
            case 'functioncall':
                let methodName = '', args = [];
                switch (expression.func) {
                    // String Functions
                    case 'substringof': // bool substringof(string po, string p1)
                    //expression.args ? expression.args.map((arg) => this.transform(arg))
                    case 'endswith': // bool endswith(string p0, string p1)
                    case 'startswith': // bool startswith(string p0, string p1)
                    case 'length': // int length(string p0)
                    case 'indexof': // int indexof(string p0, string p1)
                    case 'replace': // string replace(string p0, string find, string replace)
                    case 'substring': // string substring(string p0, int pos, int? length)
                    case 'tolower': // string tolower(string p0)
                    case 'toupper': // string toupper(string p0)
                    case 'trim': // string trim(string p0)
                    case 'concat': // string concat(string p0, string p1)
                    // Date Functions
                    case 'day': // int day(DateTime p0)
                    case 'hour': // int hour(DateTime p0)
                    case 'minute': // int minute(DateTime p0)
                    case 'month': // int month(DateTime p0)
                    case 'second': // int second(DateTime p0)
                    case 'year': // int year(DateTime p0)
                    // Math Functions
                    case 'round': // number round(number p0)
                    case 'floor': // number floor(number p0)
                    case 'ceiling': // number ceiling(number p0)
                    // Type Functions
                    case 'isof': // bool IsOf(type p0) | bool IsOf(expression p0, type p1)
                    default:
                        methodName = expression.func;
                }
                return new methodexpression_1.MethodExpression(methodName, expression.args ? expression.args.map((arg) => this.transformOData(arg)) : [], null);
            case 'literal':
                return new literalexpression_1.LiteralExpression(expression.value);
            case 'and':
                return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.And, this.transformOData(expression.left), this.transformOData(expression.right));
            case 'or':
                return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Or, this.transformOData(expression.left), this.transformOData(expression.right));
            case 'not':
                return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Invert, unaryexpression_1.UnaryAffixType.Prefix, this.transformOData(expression.argument));
            case 'eq':
                return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Equal, this.transformOData(expression.left), this.transformOData(expression.right));
            case 'ne':
                return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.NotEqual, this.transformOData(expression.left), this.transformOData(expression.right));
            case 'lt':
                return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Lesser, this.transformOData(expression.left), this.transformOData(expression.right));
            case 'le':
                return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.LesserOrEqual, this.transformOData(expression.left), this.transformOData(expression.right));
            case 'gt':
                return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Greater, this.transformOData(expression.left), this.transformOData(expression.right));
            case 'ge':
                return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.GreaterOrEqual, this.transformOData(expression.left), this.transformOData(expression.right));
            case 'add':
                return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Addition, this.transformOData(expression.left), this.transformOData(expression.right));
            case 'sub':
                return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Subtraction, this.transformOData(expression.left), this.transformOData(expression.right));
            case 'mul':
                return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Multiplication, this.transformOData(expression.left), this.transformOData(expression.right));
            case 'div':
                return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Division, this.transformOData(expression.left), this.transformOData(expression.right));
            case 'mod':
                return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Modulus, this.transformOData(expression.left), this.transformOData(expression.right));
            default:
                throw new Error('Expression type "' + expression.type + '" is unknown');
        }
    }
    /**
     * transforming jsep expression ast tree to our internal ast tree to make it easier to swap expression parser at a later time
     * @param expression jsep expression object
     */
    transform(expression) {
        var child;
        switch (expression.type) {
            case 'Compound':
                return Object.create(expression_1.Expression, {
                    type: expression_1.ExpressionType.Compound,
                    body: expression.body ? expression.body.map((expr) => this.transform(expr)) : []
                });
            case 'Identifier':
                return new identifierexpression_1.IdentifierExpression(expression.name);
            case 'ThisExpression':
                return new identifierexpression_1.IdentifierExpression('this');
            case 'MemberExpression':
                child = this.transform(expression.object);
                if (child.type == expression_1.ExpressionType.Member)
                    return new memberexpression_1.MemberExpression(child.object, new memberexpression_1.MemberExpression(child.property, (expression.computed == true ? new arrayexpression_1.ArrayExpression([this.transform(expression.property)]) : this.transform(expression.property)))); // this.ar[5] should be member 'this' with property member 'ar' with property [5].
                else
                    return new memberexpression_1.MemberExpression(child, this.transform(expression.property));
            case 'Literal':
                return new literalexpression_1.LiteralExpression(expression.value);
            case 'CallExpression':
                switch (expression.callee.type) {
                    case 'MemberExpression':
                        return new methodexpression_1.MethodExpression(expression.callee.property.name, expression.arguments ? expression.arguments.map((arg) => this.transform(arg)) : [], this.transform(expression.callee.object));
                    default:
                        throw new Error('Caller of method expression is not a MemberExpression, but is ' + expression.callee.type);
                }
            case 'UnaryExpression':
                var operatorTypeUnary;
                switch (expression.operator) {
                    case '!':
                        return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Invert, expression.prefix === true ? unaryexpression_1.UnaryAffixType.Prefix : unaryexpression_1.UnaryAffixType.Postfix, this.transform(expression.argument));
                    case '~':
                        return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Complement, expression.prefix === true ? unaryexpression_1.UnaryAffixType.Prefix : unaryexpression_1.UnaryAffixType.Postfix, this.transform(expression.argument));
                    case '+':
                    case '++':
                        if (expression.argument == false) {
                            return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Negative, expression.prefix === true ? unaryexpression_1.UnaryAffixType.Prefix : unaryexpression_1.UnaryAffixType.Postfix, null);
                        }
                        else {
                            child = this.transform(expression.argument);
                            if (child.type == expression_1.ExpressionType.Unary)
                                return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Increment, expression.prefix === true ? unaryexpression_1.UnaryAffixType.Prefix : unaryexpression_1.UnaryAffixType.Postfix, child.argument);
                            else
                                return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Positive, expression.prefix === true ? unaryexpression_1.UnaryAffixType.Prefix : unaryexpression_1.UnaryAffixType.Postfix, this.transform(expression.argument));
                        }
                    case '-':
                    case '--':
                        if (expression.argument == false) {
                            return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Negative, expression.prefix === true ? unaryexpression_1.UnaryAffixType.Prefix : unaryexpression_1.UnaryAffixType.Postfix, null);
                        }
                        else {
                            child = this.transform(expression.argument);
                            if (child.type == expression_1.ExpressionType.Unary)
                                return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Decrement, expression.prefix === true ? unaryexpression_1.UnaryAffixType.Prefix : unaryexpression_1.UnaryAffixType.Postfix, child.argument);
                            else
                                return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Negative, expression.prefix === true ? unaryexpression_1.UnaryAffixType.Prefix : unaryexpression_1.UnaryAffixType.Postfix, this.transform(expression.argument));
                        }
                    default:
                        throw new Error('Operator "' + expression.operator + '" is unknown for ' + expression.type);
                }
            case 'LogicalExpression':
            case 'BinaryExpression':
                switch (expression.operator) {
                    case '|':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Or, this.transform(expression.left), this.transform(expression.right));
                    case '^':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.ExclusiveOr, this.transform(expression.left), this.transform(expression.right));
                    case '&':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.And, this.transform(expression.left), this.transform(expression.right));
                    case '<<':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.LeftShift, this.transform(expression.left), this.transform(expression.right));
                    case '>>':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.RightShift, this.transform(expression.left), this.transform(expression.right));
                    case '>>>':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.RightShift, this.transform(expression.left), this.transform(expression.right));
                    case '+':
                        child = this.transform(expression.right); // 5++ is handled as binary expression with right side a unaryexpression with empty argument
                        if (child.type == expression_1.ExpressionType.Unary && child.argument == null)
                            if ((child = this.transform(expression.left)).type == expression_1.ExpressionType.Binary)
                                return new binaryexpression_1.BinaryExpression(child.operator, child.left, new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Increment, unaryexpression_1.UnaryAffixType.Postfix, child.right));
                            else
                                return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Increment, unaryexpression_1.UnaryAffixType.Postfix, this.transform(expression.left));
                        else
                            return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Addition, this.transform(expression.left), child);
                    case '-':
                        child = this.transform(expression.right); // 5-- is handled as binary expression (5)-(-) with right side a unaryexpression with empty argument
                        if (child.type == expression_1.ExpressionType.Unary && child.argument == null)
                            if ((child = this.transform(expression.left)).type == expression_1.ExpressionType.Binary)
                                return new binaryexpression_1.BinaryExpression(child.operator, child.left, new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Decrement, unaryexpression_1.UnaryAffixType.Postfix, child.right));
                            else
                                return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Decrement, unaryexpression_1.UnaryAffixType.Postfix, this.transform(expression.left));
                        else
                            return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Subtraction, this.transform(expression.left), child);
                    case '*':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Multiplication, this.transform(expression.left), this.transform(expression.right));
                    case '/':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Division, this.transform(expression.left), this.transform(expression.right));
                    case '%':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Modulus, this.transform(expression.left), this.transform(expression.right));
                    case '==':
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Equal, this.transform(expression.left), this.transform(expression.right));
                    case '!=':
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.NotEqual, this.transform(expression.left), this.transform(expression.right));
                    case '===':
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Equal, this.transform(expression.left), this.transform(expression.right));
                    case '!==':
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.NotEqual, this.transform(expression.left), this.transform(expression.right));
                    case '<':
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Lesser, this.transform(expression.left), this.transform(expression.right));
                    case '>':
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Greater, this.transform(expression.left), this.transform(expression.right));
                    case '<=':
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.LesserOrEqual, this.transform(expression.left), this.transform(expression.right));
                    case '>=':
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.GreaterOrEqual, this.transform(expression.left), this.transform(expression.right));
                    case '||':
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Or, this.transform(expression.left), this.transform(expression.right));
                    case '&&':
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.And, this.transform(expression.left), this.transform(expression.right));
                    default:
                        throw new Error('Operator "' + expression.operator + '" is unknown for ' + expression.type);
                }
            case 'ConditionalExpression':
                return {
                    type: expression_1.ExpressionType.Conditional,
                    condition: this.transform(expression.test),
                    success: this.transform(expression.consequent),
                    failure: this.transform(expression.alternate)
                };
            case 'ArrayExpression':
                return {
                    type: expression_1.ExpressionType.Array,
                    elements: expression.elements ? expression.elements.map((arg) => this.transform(arg)) : []
                };
            default:
                return null;
        }
    }
}
exports.ExpressionVisitor = ExpressionVisitor;
//export { IExpression, Expression, ExpressionType } from './expression';
//export { IArrayExpression, IBinaryExpression, ICompoundExpression, IConditionalExpression, IIdentifierExpression, ILiteralExpression, ILogicalExpression, IMemberExpression, IMethodExpression, IUnaryExpression }
var expression_2 = require("./expression");
exports.Expression = expression_2.Expression;
exports.ExpressionType = expression_2.ExpressionType;
var literalexpression_2 = require("./literalexpression");
exports.LiteralExpression = literalexpression_2.LiteralExpression;
var identifierexpression_2 = require("./identifierexpression");
exports.IdentifierExpression = identifierexpression_2.IdentifierExpression;
var memberexpression_2 = require("./memberexpression");
exports.MemberExpression = memberexpression_2.MemberExpression;
var methodexpression_2 = require("./methodexpression");
exports.MethodExpression = methodexpression_2.MethodExpression;
var unaryexpression_2 = require("./unaryexpression");
exports.UnaryExpression = unaryexpression_2.UnaryExpression;
exports.UnaryOperatorType = unaryexpression_2.UnaryOperatorType;
exports.UnaryAffixType = unaryexpression_2.UnaryAffixType;
var binaryexpression_2 = require("./binaryexpression");
exports.BinaryExpression = binaryexpression_2.BinaryExpression;
exports.BinaryOperatorType = binaryexpression_2.BinaryOperatorType;
var logicalexpression_2 = require("./logicalexpression");
exports.LogicalExpression = logicalexpression_2.LogicalExpression;
exports.LogicalOperatorType = logicalexpression_2.LogicalOperatorType;
var arrayexpression_2 = require("./arrayexpression");
exports.ArrayExpression = arrayexpression_2.ArrayExpression;
//# sourceMappingURL=expressionvisitor.js.map