"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("./../linq/expressions/expressionvisitor");
describe("When using ExpressionVisitor for template literal Lambda expression", () => {
    var visitor, expr;
    beforeEach(() => {
        visitor = new Expr.ExpressionVisitor;
    });
    it("it should handle toString", () => {
        assert.equal(visitor.visitLambda(() => `My number is ${5} and the next is ${5 + 1}`).toString(), '`My number is ${5} and the next is ${5 + 1}`');
    });
});
//# sourceMappingURL=expressionvisitor_templateliteral_expression.js.map