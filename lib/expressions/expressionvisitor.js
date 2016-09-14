"use strict";
const jsep = require('jsep');
const expression_1 = require('./expression');
const literalexpression_1 = require('./literalexpression');
const identifierexpression_1 = require('./identifierexpression');
const memberexpression_1 = require('./memberexpression');
const methodexpression_1 = require('./methodexpression');
const unaryexpression_1 = require('./unaryexpression');
const binaryexpression_1 = require('./binaryexpression');
const logicalexpression_1 = require('./logicalexpression');
const arrayexpression_1 = require('./arrayexpression');
const lambdaexpression_1 = require('./lambdaexpression');
class ExpressionVisitor {
    constructor() {
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
var expression_2 = require('./expression');
exports.Expression = expression_2.Expression;
exports.ExpressionType = expression_2.ExpressionType;
var literalexpression_2 = require('./literalexpression');
exports.LiteralExpression = literalexpression_2.LiteralExpression;
var identifierexpression_2 = require('./identifierexpression');
exports.IdentifierExpression = identifierexpression_2.IdentifierExpression;
var memberexpression_2 = require('./memberexpression');
exports.MemberExpression = memberexpression_2.MemberExpression;
var methodexpression_2 = require('./methodexpression');
exports.MethodExpression = methodexpression_2.MethodExpression;
var unaryexpression_2 = require('./unaryexpression');
exports.UnaryExpression = unaryexpression_2.UnaryExpression;
exports.UnaryOperatorType = unaryexpression_2.UnaryOperatorType;
exports.UnaryAffixType = unaryexpression_2.UnaryAffixType;
var binaryexpression_2 = require('./binaryexpression');
exports.BinaryExpression = binaryexpression_2.BinaryExpression;
exports.BinaryOperatorType = binaryexpression_2.BinaryOperatorType;
var logicalexpression_2 = require('./logicalexpression');
exports.LogicalExpression = logicalexpression_2.LogicalExpression;
exports.LogicalOperatorType = logicalexpression_2.LogicalOperatorType;
var arrayexpression_2 = require('./arrayexpression');
exports.ArrayExpression = arrayexpression_2.ArrayExpression;
//# sourceMappingURL=expressionvisitor.js.map