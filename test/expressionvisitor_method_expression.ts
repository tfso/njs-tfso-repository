import assert = require('assert');
import * as Expr from './../lib/expressions/expressionvisitor';

describe("When using ExpressionVisitor for method Lambda expression", () => {
    var visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression;

    beforeEach(() => {
        visitor = new Expr.ExpressionVisitor;
    })

    it("it should return a method expression", () => {
        expr = visitor.visitLambda((str: string) => str.indexOf("a"));

        assert.ok(expr.type == Expr.ExpressionType.Method, "Expected a MethodExpression");
        assert.ok((<Expr.IMethodExpression>expr).name == "indexOf", "Expected method name 'indexOf'");
        assert.ok((<Expr.IMethodExpression>expr).parameters.length == 1, "Expected one argument");
        assert.ok((<Expr.IMethodExpression>expr).caller.type == Expr.ExpressionType.Identifier, "Expected a identifier as caller");
    })

    it("it should return a method expression for nested calls", () => {
        expr = visitor.visitLambda((str: string) => str.indexOf("a").toString());

        assert.ok(expr.type == Expr.ExpressionType.Method, "Expected a MethodExpression");
        assert.ok((<Expr.IMethodExpression>expr).name == "toString", "Expected method name 'toString'");
        assert.ok((<Expr.IMethodExpression>expr).parameters.length == 0, "Expected zero arguments");
        assert.ok((<Expr.IMethodExpression>expr).caller.type == Expr.ExpressionType.Method, "Expected a new method as caller");

        assert.ok((<Expr.IMethodExpression>((<Expr.IMethodExpression>expr).caller)).name == "indexOf", "Expected method name 'indexOf'");
        assert.ok((<Expr.IMethodExpression>((<Expr.IMethodExpression>expr).caller)).parameters.length == 1, "Expected one argument");
        assert.ok((<Expr.IMethodExpression>((<Expr.IMethodExpression>expr).caller)).caller.type == Expr.ExpressionType.Identifier, "Expected a identifier as caller");
    })
});
