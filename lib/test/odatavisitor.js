"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("./../linq/expressions/expressionvisitor");
const odatavisitor_1 = require("./../linq/expressions/odatavisitor");
describe("When using OData for ExpressionVisitor", () => {
    var reducer, vars = { number: 5, stringhavingdate: '2018-05-30Z', string: 'abc', decimal: 5.50, date: new Date("2017-05-10T06:48:00Z"), object: { number: 7 } };
    beforeEach(() => {
        reducer = new odatavisitor_1.ODataVisitor();
    });
    it("should evaluate a simple expression with binary operation", () => {
        let reduced = reducer.visitOData("2 add 3"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 5);
    });
    it("should evaluate a simple expression with binary operation and identifier", () => {
        let reduced = reducer.visitOData("2 add number"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 7);
    });
    it("should evaluate a expression with binary operation and method 'length' with Identifier Expression", () => {
        let reduced = reducer.visitOData("2 add length(string)"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 5);
    });
    it("should evaluate a expression with binary operation and method 'floor' with Identifier Expression", () => {
        let reduced = reducer.visitOData("2 add floor(decimal)"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 7);
    });
    it("should evaluate a expression with binary operation and method 'ceiling' with Identifier Expression", () => {
        let reduced = reducer.visitOData("2 add ceiling(decimal)"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 8);
    });
    it("should evaluate a expression with binary operation and method 'ceiling' with Literal Expression", () => {
        let reduced = reducer.visitOData("2 add ceiling(5.50)"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 8);
    });
    it("should evaluate a expression with contains", () => {
        let reduced = reducer.visitOData("contains(string, 'bc')"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, true);
    });
    it("should evaluate a expression with contains", () => {
        let reduced = reducer.visitOData("contains(stringhavingdate, 'bc')"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, false);
    });
    it("should evaluate a expression with date as type (v4)", () => {
        let reduced = reducer.visitOData("date ge 2017-05-01Z"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, true);
    });
    it("should evaluate a expression with date as type for lesser (v4)", () => {
        let reduced = reducer.visitOData("date le 2017-05-20Z"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, true);
    });
    it("should evaluate a expression with datetime as type (v4)", () => {
        let reduced = reducer.visitOData("date ge 2017-05-01T12:00:00Z"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, true);
    });
    it("should evaluate a expression with date as string", () => {
        let reduced = reducer.visitOData("date ge datetime'2017-05-01Z'"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, true);
    });
    it("should evaluate a expression with datetime as string", () => {
        let reduced = reducer.visitOData("date ge datetime'2017-05-01T12:00:00Z'"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, true);
    });
    it("should evaluate a expression with binary operation and method 'year' with a Date type", () => {
        let reduced = reducer.visitOData("year(date) sub year(2016-05-01)"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 1);
    });
    it("should evaluate a complex expression with binary operation and method 'year' with a Date type", () => {
        let reduced = reducer.visitOData("(number add 2012) sub year(2016-05-01)"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 1);
    });
    it("should evaluate a complex expression that is using casing", () => {
        let reduced = reducer.visitOData("(number Add 2012) SUB year(2016-05-01)"), expr = reducer.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 1);
    });
    it("should evaluate a complex expression with binary operation", () => {
        let reduced = reducer.visitOData("number ge 5 and number lt 10"), expr = reducer.evaluate(reduced, vars);
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok(expr.value == true, "Expected a literal of value true");
    });
    it("should evaluate a complex expression with binary operation using object", () => {
        let reduced = reducer.visitOData("object/number ge 7 and object/number lt 10 and number eq 5"), expr = reducer.evaluate(reduced, vars);
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok(expr.value == true, "Expected a literal of value true");
    });
});
//# sourceMappingURL=odatavisitor.js.map