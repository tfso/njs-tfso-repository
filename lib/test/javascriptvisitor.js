"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("./../linq/expressions/expressionvisitor");
const javascriptvisitor_1 = require("./../linq/expressions/javascriptvisitor");
describe("When using JavascriptVisitor", () => {
    var parser, vars = { number: 5, string: 'abc', decimal: 5.50, date: new Date("2017-05-10T06:48:00Z"), object: { number: 7 } };
    beforeEach(() => {
        parser = new javascriptvisitor_1.JavascriptVisitor();
    });
    it("should evaluate a simple expression with binary operation", () => {
        let reduced = parser.visitLambda(() => 2 + 3), expr = parser.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 5);
    });
    it("should be able to do string operations at literal", () => {
        let reduced = parser.visitLambda(() => "ABC".toLowerCase()), expr = parser.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 'abc');
    });
    it("should be able to do string operations at variables", () => {
        let reduced = parser.visitLambda(() => this.string.toUpperCase()), expr = parser.evaluate(reduced, vars);
        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal(expr.value, 'ABC');
    });
});
//# sourceMappingURL=javascriptvisitor.js.map