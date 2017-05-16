import * as assert from 'assert';
import * as Expr from './../linq/expressions/expressionvisitor';
import { ODataVisitor } from './../linq/expressions/odatavisitor';

describe("When using OData for ExpressionVisitor", () => {
    var reducer: ODataVisitor,
        expr: Expr.IExpression;

    beforeEach(() => {
        reducer = new ODataVisitor({ number: 5, string: 'abc', decimal: 5.50, date: new Date("2017-05-10T06:48:00Z") });
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

    it("should evaluate a expression with date as type (v4)", () => {
        expr = reducer.visitOData("date ge 2017-05-01Z");

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, true);
    })

    it("should evaluate a expression with datetime as type (v4)", () => {
        expr = reducer.visitOData("date ge 2017-05-01T12:00:00Z");

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, true);
    })

    it("should evaluate a expression with date as string", () => {
        expr = reducer.visitOData("date ge '2017-05-01Z'");

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, true);
    })

    it("should evaluate a expression with datetime as string", () => {
        expr = reducer.visitOData("date ge '2017-05-01T12:00:00Z'");

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, true);
    })

    it("should evaluate a expression with binary operation and method 'year' with a Date type", () => {
        expr = reducer.visitOData("year(date) sub year(2016-05-01)");

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 1);
    })

    it("should evaluate a complex expression with binary operation and method 'year' with a Date type", () => {
        expr = reducer.visitOData("(number add 2012) sub year(2016-05-01)");

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 1);
    })

    it("should evaluate a complex expression that is using casing", () => {
        expr = reducer.visitOData("(number Add 2012) SUB year(2016-05-01)");

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 1);
    })

    it("should evaluate a complex expression with binary operation", () => {

        expr = reducer.visitOData("number ge 5 and number lt 10");

        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value true");
    })
})