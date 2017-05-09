"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("./../linq/expressions/expressionvisitor");
const odatavisitor_1 = require("./../linq/expressions/odatavisitor");
describe("When using OData for ExpressionVisitor", () => {
    var reducer, expr;
    beforeEach(() => {
        reducer = new odatavisitor_1.ODataVisitor({ number: 5, string: 'abc', decimal: 5.50 });
    });
    it("should evaluate a simple expression with binary operation", () => {
        expr = reducer.visitOData("2 add 3");
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 5);
    });
    it("should evaluate a simple expression with binary operation and identifier", () => {
        expr = reducer.visitOData("2 add number");
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 7);
    });
    it("should evaluate a expression with binary operation and method 'length' with Identifier Expression", () => {
        expr = reducer.visitOData("2 add length(string)");
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 5);
    });
    it("should evaluate a expression with binary operation and method 'floor' with Identifier Expression", () => {
        expr = reducer.visitOData("2 add floor(decimal)");
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 7);
    });
    it("should evaluate a expression with binary operation and method 'ceiling' with Identifier Expression", () => {
        expr = reducer.visitOData("2 add ceiling(decimal)");
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 8);
    });
    it("should evaluate a expression with binary operation and method 'ceiling' with Literal Expression", () => {
        expr = reducer.visitOData("2 add ceiling(5.50)");
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 8);
    });
});
//# sourceMappingURL=odatavisitor.js.map