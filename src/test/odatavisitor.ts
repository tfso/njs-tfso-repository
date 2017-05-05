import * as assert from 'assert';
import * as Expr from './../linq/expressions/expressionvisitor';
import { ODataVisitor } from './../linq/expressions/odatavisitor';

describe("When using OData for ExpressionVisitor", () => {
    var reducer: ODataVisitor,
        expr: Expr.IExpression;

    beforeEach(() => {
        reducer = new ODataVisitor({ number: 5, string: 'abc', decimal: 5.50 });
    })

    it("should evaluate a simple expression with binary operation", () => {
        expr = reducer.visitOData("2 add 3");

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 5);
    })

    it("should evaluate a simple expression with binary operation and identifier", () => {
        expr = reducer.visitOData("2 add number");

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 7);
    })

    it("should evaluate a expression with binary operation and method 'length' with Identifier Expression", () => {
        expr = reducer.visitOData("2 add length(string)");

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 5);
    })

    it("should evaluate a expression with binary operation and method 'floor' with Identifier Expression", () => {
        expr = reducer.visitOData("2 add floor(decimal)");

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 7);
    })

    it("should evaluate a expression with binary operation and method 'ceiling' with Identifier Expression", () => {
        expr = reducer.visitOData("2 add ceiling(decimal)");

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 8);
    })

    it("should evaluate a expression with binary operation and method 'ceiling' with Literal Expression", () => {
        expr = reducer.visitOData("2 add ceiling(5.50)");

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 8);
    })
})