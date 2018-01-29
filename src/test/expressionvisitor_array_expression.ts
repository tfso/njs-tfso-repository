import * as assert from 'assert';
import * as Expr from './../linq/expressions/expressionvisitor';

describe("When using ExpressionVisitor for array Lambda expression", () => {
    var visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression;

    beforeEach(() => {
        visitor = new Expr.ExpressionVisitor;
    })

    it("it should handle toString", () => {
        assert.equal(visitor.visitLambda(() => ['yes', 'no']).toString(), '["yes", "no"]');
        assert.equal(visitor.visitLambda(() => [1, 2+4, 4, 8]).toString(), "[1, 2 + 4, 4, 8]");
        assert.equal(visitor.visitLambda(() => [1, 2+4*4, 4, 8]).toString(), "[1, 2 + (4 * 4), 4, 8]");
    });

});
