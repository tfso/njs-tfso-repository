import * as assert from 'assert';
import * as Expr from './../linq/expressions/expressionvisitor';

describe("When using ExpressionVisitor for object Lambda expression", () => {
    var visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression;

    beforeEach(() => {
        visitor = new Expr.ExpressionVisitor;
    })

    it("it should handle toString", () => {
        assert.equal(visitor.visitLambda(() => <object>{ "key": 123, "value": "abc" }).toString(), '{"key": 123, "value": "abc"}');
        assert.equal(visitor.visitLambda(() => <object>{ key: 123, value: "abc" }).toString(), '{"key": 123, "value": "abc"}');
        assert.equal(visitor.visitLambda(() => <object>{ 0: 123, 1: "abc" }).toString(), '{"0": 123, "1": "abc"}');
    })
});
