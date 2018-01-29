import * as assert from 'assert';
import * as Expr from './../linq/expressions/expressionvisitor';

describe("When using ExpressionVisitor for template literal Lambda expression", () => {
    var visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression;

    beforeEach(() => {
        visitor = new Expr.ExpressionVisitor;
    })

    it("it should handle toString", () => {
        assert.equal(visitor.visitLambda(() => `My number is ${5} and the next is ${5+1}`).toString(), '`My number is ${5} and the next is ${5 + 1}`');
    })
});
