﻿import * as jsep from 'jsep';
import OData from './../../lib/odata-parser';

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


export class ExpressionStack {
    private items: Array<IExpression>;
    private count: number;

    constructor() {
        this.items = [];
        this.count = 0;
    }

    public length() {
        return this.count;
    }

    public push(item: IExpression) {
        this.items.push(item);
        this.count = this.count + 1;
    }

    public pop(): IExpression {
        if (this.count > 0) {
            this.count = this.count - 1;
        }

        return this.items.pop();
    }

    public peek(): IExpression {
        if (this.count <= 1)
            return null;

        return this.items[this.count - 2]; // current object is always last
    }
}

export class ExpressionVisitor {
    protected _lambdaExpression: LambdaExpression;
    private _expressionStack: ExpressionStack;

    constructor() {
        this._expressionStack = new ExpressionStack();
    }

    public get stack(): ExpressionStack {
        return this._expressionStack;
    }

    public visitOData(filter: string): IExpression {
        filter = filter.replace(/["']?(\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?)?(?:Z|[+-]\d{2}:\d{2})?)["']?/gi, (value, date) => ['\'', date, '\''].join('')); // odata-parser doesn't support date as type, converting it to string

        let ast = OData.parse(filter);
        try {
            if (ast) {
                return this.visit(this.transformOData(ast));
            }
        }
        catch (ex) {
            throw new Error(ex.message);
        }

        return null;
    }

    public visitLambda(predicate: (it: Object, ...param: Array<any>) => any): IExpression {
        var expression = (this._lambdaExpression = new LambdaExpression(predicate)).expression;

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

    public visit(expression: IExpression): IExpression {
        return expression.accept(this);
    }

    public visitLiteral(expression: ILiteralExpression): IExpression {
        switch (typeof expression.value) {
            case 'string':

                break;

            case 'number':

                break;
        }

        return expression;
    }

    public visitArray(expression: IArrayExpression): IExpression {
        expression.elements = expression.elements.map((element) => element.accept(this));

        return expression;
    }

    public visitCompound(expression: ICompoundExpression): IExpression {
        expression.body = expression.body.map((expr) => expr.accept(this));

        return expression;
    }

    public visitIdentifier(expression: IIdentifierExpression): IExpression {
        return expression;
    }

    public visitBinary(expression: IBinaryExpression): IExpression {
        expression.left = expression.left.accept(this);
        expression.right = expression.right.accept(this);

        return expression;
    }


    public visitMethod(expression: IMethodExpression): IExpression {
        if(expression.caller)
            expression.caller = expression.caller.accept(this);

        expression.parameters = expression.parameters.map((arg) => arg.accept(this));

        return expression;
    }


    public visitUnary(expression: IUnaryExpression): IExpression {
        expression.argument = expression.argument.accept(this);

        return expression;
    }

    public visitMember(expression: IMemberExpression): IExpression {
        expression.object = expression.object.accept(this);
        expression.property = expression.property.accept(this);

        return expression;
    }

    public visitLogical(expression: ILogicalExpression): IExpression {
        expression.left = expression.left.accept(this);
        expression.right = expression.right.accept(this);

        return expression;
    }

    public visitConditional(expression: IConditionalExpression): IExpression {
        expression.condition = expression.condition.accept(this);
        expression.success = expression.success.accept(this);
        expression.failure = expression.failure.accept(this);

        return expression;

    }

    /**
     * transform odata expression ast tree to our internal ast tree to make it easier to swap expression parser at a later time
     * @see
     * http://www.odata.org/documentation/odata-version-2-0/uri-conventions/
     *
     * @param filter odata filter, eg; Name eq 'John' and LastName lt 'Doe'
     * @returns 
     */
    private transformOData(expression: any): IExpression {
        var child: IExpression;

        switch (expression.type) {
            case 'Identifier':
                return new IdentifierExpression(expression.name);

            case 'MemberExpression':
                return new MemberExpression(new IdentifierExpression(expression.object), this.transformOData(expression.property));

            case 'CallExpression':
                switch (expression.object.type) {
                    case 'Identifier':
                        return new MethodExpression(expression.object.name, expression.arguments ? expression.arguments.map((arg) => this.transformOData(arg)) : [], null);

                    default:
                        throw new Error('Caller of method expression is not a Identifier, but is ' + expression.object.type);
                }

            case 'NumberLiteral':
            case 'BooleanLiteral':
            case 'NullLiteral':
            case 'Literal':
                return new LiteralExpression(expression.value)

            case 'ConditionalExpression':
            case 'ConditionalExpression':
                switch (expression.operator) {
                    case 'and':
                        return new LogicalExpression(LogicalOperatorType.And, this.transformOData(expression.left), this.transformOData(expression.right));
                    case 'or':
                        return new LogicalExpression(LogicalOperatorType.Or, this.transformOData(expression.left), this.transformOData(expression.right));
                }
                break;

            case 'LogicalExpression':
                switch (expression.operator) {
                    case 'eq': // equal
                        return new LogicalExpression(LogicalOperatorType.Equal, this.transformOData(expression.left), this.transformOData(expression.right));

                    case 'ne': // not equal
                        return new LogicalExpression(LogicalOperatorType.NotEqual, this.transformOData(expression.left), this.transformOData(expression.right));

                    case 'lt': // lesser
                        return new LogicalExpression(LogicalOperatorType.Lesser, this.transformOData(expression.left), this.transformOData(expression.right));

                    case 'le': // lesser or equal
                        return new LogicalExpression(LogicalOperatorType.LesserOrEqual, this.transformOData(expression.left), this.transformOData(expression.right));

                    case 'gt': // greater
                        return new LogicalExpression(LogicalOperatorType.Greater, this.transformOData(expression.left), this.transformOData(expression.right));

                    case 'ge': // greater or equal
                        return new LogicalExpression(LogicalOperatorType.GreaterOrEqual, this.transformOData(expression.left), this.transformOData(expression.right));
                }
                break;

            case 'UnaryExpression':
                switch (expression.operator) {
                    case 'not':
                        return new UnaryExpression(UnaryOperatorType.Invert, UnaryAffixType.Prefix, this.transformOData(expression.argument));
                    case '+':
                        return new UnaryExpression(UnaryOperatorType.Positive, UnaryAffixType.Prefix, this.transformOData(expression.argument));
                    case '-':
                        return new UnaryExpression(UnaryOperatorType.Negative, UnaryAffixType.Prefix, this.transformOData(expression.argument));
                }
                break;

            case 'BinaryExpression':
                switch (expression.operator) {
                    case 'add': // addition
                        return new BinaryExpression(BinaryOperatorType.Addition, this.transformOData(expression.left), this.transformOData(expression.right));

                    case 'sub': // subtraction
                        return new BinaryExpression(BinaryOperatorType.Subtraction, this.transformOData(expression.left), this.transformOData(expression.right));

                    case 'mul': // multiplication
                        return new BinaryExpression(BinaryOperatorType.Multiplication, this.transformOData(expression.left), this.transformOData(expression.right));

                    case 'div': // division
                        return new BinaryExpression(BinaryOperatorType.Division, this.transformOData(expression.left), this.transformOData(expression.right));

                    case 'mod': // modulus
                        return new BinaryExpression(BinaryOperatorType.Modulus, this.transformOData(expression.left), this.transformOData(expression.right));
                }
                break;                
        }

        throw new Error('Expression type "' + expression.type + '" is unknown');
    }

    /**
     * transforming jsep expression ast tree to our internal ast tree to make it easier to swap expression parser at a later time
     * @param expression jsep expression object
     */
    private transform(expression: any): IExpression {
        var child: IExpression;

        switch (expression.type) {
            case 'Compound':
                return Object.create(Expression, <PropertyDescriptorMap><Object><ICompoundExpression>{
                    type: ExpressionType.Compound,
                    body: expression.body ? expression.body.map((expr) => this.transform(expr)) : []
                });

            case 'Identifier':
                return new IdentifierExpression(expression.name);

            case 'ThisExpression':
                return new IdentifierExpression('this');

            case 'MemberExpression':
                child = this.transform(expression.object);
                if (child.type == ExpressionType.Member)
                    return new MemberExpression((<IMemberExpression>child).object, new MemberExpression((<IMemberExpression>child).property, (expression.computed == true ? new ArrayExpression([this.transform(expression.property)]) : this.transform(expression.property)))); // this.ar[5] should be member 'this' with property member 'ar' with property [5].
                else
                    return new MemberExpression(child, this.transform(expression.property));

            case 'Literal':
                return new LiteralExpression(expression.value);

            case 'CallExpression':
                switch (expression.callee.type) {
                    case 'MemberExpression':
                        return new MethodExpression(expression.callee.property.name, expression.arguments ? expression.arguments.map((arg) => this.transform(arg)) : [], this.transform(expression.callee.object));

                    default:
                        throw new Error('Caller of method expression is not a MemberExpression, but is ' + expression.callee.type);
                }

            case 'UnaryExpression':
                var operatorTypeUnary: UnaryOperatorType;
                switch (expression.operator) {
                    case '!':
                        return new UnaryExpression(UnaryOperatorType.Invert, expression.prefix === true ? UnaryAffixType.Prefix : UnaryAffixType.Postfix, this.transform(expression.argument));
                    case '~':
                        return new UnaryExpression(UnaryOperatorType.Complement, expression.prefix === true ? UnaryAffixType.Prefix : UnaryAffixType.Postfix, this.transform(expression.argument));
                    case '+':
                    case '++':
                        if (expression.argument == false) {
                            return new UnaryExpression(UnaryOperatorType.Negative, expression.prefix === true ? UnaryAffixType.Prefix : UnaryAffixType.Postfix, null);
                        }
                        else {
                            child = this.transform(expression.argument);
                            if (child.type == ExpressionType.Unary)
                                return new UnaryExpression(UnaryOperatorType.Increment, expression.prefix === true ? UnaryAffixType.Prefix : UnaryAffixType.Postfix, (<IUnaryExpression>child).argument)
                            else
                                return new UnaryExpression(UnaryOperatorType.Positive, expression.prefix === true ? UnaryAffixType.Prefix : UnaryAffixType.Postfix, this.transform(expression.argument));
                        }
                    case '-':
                    case '--':
                        if (expression.argument == false) {
                            return new UnaryExpression(UnaryOperatorType.Negative, expression.prefix === true ? UnaryAffixType.Prefix : UnaryAffixType.Postfix, null);
                        }
                        else {
                            child = this.transform(expression.argument);
                            if (child.type == ExpressionType.Unary)
                                return new UnaryExpression(UnaryOperatorType.Decrement, expression.prefix === true ? UnaryAffixType.Prefix : UnaryAffixType.Postfix, (<IUnaryExpression>child).argument)
                            else
                                return new UnaryExpression(UnaryOperatorType.Negative, expression.prefix === true ? UnaryAffixType.Prefix : UnaryAffixType.Postfix, this.transform(expression.argument));
                        }
                    default:
                        throw new Error('Operator "' + expression.operator + '" is unknown for ' + expression.type);
                }

            case 'LogicalExpression':
            case 'BinaryExpression':
                switch (expression.operator) {
                    case '|':
                        return new BinaryExpression(BinaryOperatorType.Or, this.transform(expression.left), this.transform(expression.right));
                    case '^':
                        return new BinaryExpression(BinaryOperatorType.ExclusiveOr, this.transform(expression.left), this.transform(expression.right));
                    case '&':
                        return new BinaryExpression(BinaryOperatorType.And, this.transform(expression.left), this.transform(expression.right));
                    case '<<':
                        return new BinaryExpression(BinaryOperatorType.LeftShift, this.transform(expression.left), this.transform(expression.right));
                    case '>>':
                        return new BinaryExpression(BinaryOperatorType.RightShift, this.transform(expression.left), this.transform(expression.right));
                    case '>>>': // zero-fill right-shift 
                        return new BinaryExpression(BinaryOperatorType.RightShift, this.transform(expression.left), this.transform(expression.right));
                    case '+':
                        child = this.transform(expression.right); // 5++ is handled as binary expression with right side a unaryexpression with empty argument
                        if (child.type == ExpressionType.Unary && (<IUnaryExpression>child).argument == null)
                            if ((child = this.transform(expression.left)).type == ExpressionType.Binary) // 5+a++ is handled with wrong precedence (5+a)+(+), this will fix it
                                return new BinaryExpression((<IBinaryExpression>child).operator, (<IBinaryExpression>child).left, new UnaryExpression(UnaryOperatorType.Increment, UnaryAffixType.Postfix, (<IBinaryExpression>child).right));
                            else
                                return new UnaryExpression(UnaryOperatorType.Increment, UnaryAffixType.Postfix, this.transform(expression.left))
                        else
                            return new BinaryExpression(BinaryOperatorType.Addition, this.transform(expression.left), child);
                    case '-':
                        child = this.transform(expression.right); // 5-- is handled as binary expression (5)-(-) with right side a unaryexpression with empty argument
                        if (child.type == ExpressionType.Unary && (<IUnaryExpression>child).argument == null)
                            if ((child = this.transform(expression.left)).type == ExpressionType.Binary) // 5-a++ is handled with wrong precedence (5-a)+(+), this will fix it
                                return new BinaryExpression((<IBinaryExpression>child).operator, (<IBinaryExpression>child).left, new UnaryExpression(UnaryOperatorType.Decrement, UnaryAffixType.Postfix, (<IBinaryExpression>child).right));
                            else
                                return new UnaryExpression(UnaryOperatorType.Decrement, UnaryAffixType.Postfix, this.transform(expression.left))
                        else
                            return new BinaryExpression(BinaryOperatorType.Subtraction, this.transform(expression.left), child);
                    case '*':
                        return new BinaryExpression(BinaryOperatorType.Multiplication, this.transform(expression.left), this.transform(expression.right));
                    case '/':
                        return new BinaryExpression(BinaryOperatorType.Division, this.transform(expression.left), this.transform(expression.right));
                    case '%':
                        return new BinaryExpression(BinaryOperatorType.Modulus, this.transform(expression.left), this.transform(expression.right));
                    case '==':
                        return new LogicalExpression(LogicalOperatorType.Equal, this.transform(expression.left), this.transform(expression.right));
                    case '!=':
                        return new LogicalExpression(LogicalOperatorType.NotEqual, this.transform(expression.left), this.transform(expression.right));
                    case '===':
                        return new LogicalExpression(LogicalOperatorType.Equal, this.transform(expression.left), this.transform(expression.right));
                    case '!==':
                        return new LogicalExpression(LogicalOperatorType.NotEqual, this.transform(expression.left), this.transform(expression.right));
                    case '<':
                        return new LogicalExpression(LogicalOperatorType.Lesser, this.transform(expression.left), this.transform(expression.right));
                    case '>':
                        return new LogicalExpression(LogicalOperatorType.Greater, this.transform(expression.left), this.transform(expression.right));
                    case '<=':
                        return new LogicalExpression(LogicalOperatorType.LesserOrEqual, this.transform(expression.left), this.transform(expression.right));
                    case '>=':
                        return new LogicalExpression(LogicalOperatorType.GreaterOrEqual, this.transform(expression.left), this.transform(expression.right));
                    case '||':
                        return new LogicalExpression(LogicalOperatorType.Or, this.transform(expression.left), this.transform(expression.right));
                    case '&&':
                        return new LogicalExpression(LogicalOperatorType.And, this.transform(expression.left), this.transform(expression.right));
                    default:
                        throw new Error('Operator "' + expression.operator + '" is unknown for ' + expression.type);
                }

            case 'ConditionalExpression':
                return <Expression><IExpression><IConditionalExpression>{
                    type: ExpressionType.Conditional,
                    condition: this.transform(expression.test),
                    success: this.transform(expression.consequent),
                    failure: this.transform(expression.alternate)
                };

            case 'ArrayExpression':
                return <Expression><IExpression><IArrayExpression>{
                    type: ExpressionType.Array,
                    elements: expression.elements ? expression.elements.map((arg) => this.transform(arg)) : []
                };

            default:
                return null;
        }
    }
}

//export { IExpression, Expression, ExpressionType } from './expression';
//export { IArrayExpression, IBinaryExpression, ICompoundExpression, IConditionalExpression, IIdentifierExpression, ILiteralExpression, ILogicalExpression, IMemberExpression, IMethodExpression, IUnaryExpression }

export { IExpression, Expression, ExpressionType } from './expression';
export { ILiteralExpression, LiteralExpression } from './literalexpression';
export { ICompoundExpression } from './compoundexpression';
export { IIdentifierExpression, IdentifierExpression } from './identifierexpression';
export { IMemberExpression, MemberExpression } from './memberexpression';
export { IMethodExpression, MethodExpression } from './methodexpression';
export { IUnaryExpression, UnaryExpression, UnaryOperatorType, UnaryAffixType } from './unaryexpression';
export { IBinaryExpression, BinaryExpression, BinaryOperatorType } from './binaryexpression';
export { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './logicalexpression';
export { IConditionalExpression } from './conditionalexpression';
export { IArrayExpression, ArrayExpression } from './arrayexpression';