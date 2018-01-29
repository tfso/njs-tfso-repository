import * as assert from 'assert';
import * as Expr from './../linq/expressions/expressionvisitor';

describe("When using ExpressionVisitor for conditional Lambda expression", () => {
    var visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression;

    beforeEach(() => {
        visitor = new Expr.ExpressionVisitor;
    })

    it("it should handle toString", () => {
        assert.equal(visitor.visitLambda(() => true ? 'yes' : 'no').toString(), '(true ? "yes" : "no")');
        assert.equal(visitor.visitLambda(() => 4 + 2 > 5 ? true : false).toString(), '((4 + 2) > 5 ? true : false)');
        assert.equal(visitor.visitLambda(() => 4 + 2 > 5 && true && false ? true : false).toString(), '((((4 + 2) > 5 && true) && false) ? true : false)');
        assert.equal(visitor.visitLambda(() => 4 + 2 > 5 || true && false ? true : false).toString(), '((4 + 2) > 5 || (true && false) ? true : false)');
    });

});
