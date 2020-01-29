"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("./../linq/expressions/expressionvisitor");
describe("When using ExpressionVisitor for conditional Lambda expression", () => {
    var visitor, expr;
    beforeEach(() => {
        visitor = new Expr.ExpressionVisitor;
    });
    it("it should handle toString", () => {
        assert.equal(visitor.visitLambda(() => true ? 'yes' : 'no').toString(), '(true ? "yes" : "no")');
        assert.equal(visitor.visitLambda(() => 4 + 2 > 5 ? true : false).toString(), '((4 + 2) > 5 ? true : false)');
        assert.equal(visitor.visitLambda(() => 4 + 2 > 5 && true && false ? true : false).toString(), '((((4 + 2) > 5 && true) && false) ? true : false)');
        assert.equal(visitor.visitLambda(() => 4 + 2 > 5 || true && false ? true : false).toString(), '((4 + 2) > 5 || (true && false) ? true : false)');
    });
});
//# sourceMappingURL=expressionvisitor_conditional_expression.js.map