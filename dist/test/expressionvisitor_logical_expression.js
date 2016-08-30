"use strict";
const assert = require('assert');
const Expr = require('./../lib/expressions/expressionvisitor');
describe("When using ExpressionVisitor for logical Lambda expression", () => {
    var visitor, expr;
    beforeEach(() => {
        visitor = new Expr.ExpressionVisitor;
    });
    it("it should return a logical operation", () => {
        expr = visitor.visitLambda(() => 5 && 2);
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.left.type == Expr.ExpressionType.Literal, "Expected a literal at left side");
        assert.ok(expr.right.type == Expr.ExpressionType.Literal, "Expected a lteral at right side");
        assert.ok(expr.left.value == 5, "Expected number 5 at left side");
        assert.ok(expr.right.value == 2, "Expected number 5 at right side");
    });
    it("it should handle logical operation for and", () => {
        expr = visitor.visitLambda(() => 5 && 2);
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.And, "Expected a binary operation of and");
    });
    it("it should handle logical operation for or", () => {
        expr = visitor.visitLambda(() => 5 || 2);
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.Or, "Expected a binary operation of or");
    });
    it("it should handle logical operation for equal", () => {
        expr = visitor.visitLambda(() => 5 == 2);
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.Equal, "Expected a binary operation of equal");
    });
    it("it should handle logical operation for not equal", () => {
        expr = visitor.visitLambda(() => 5 != 2);
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.NotEqual, "Expected a binary operation of not equal");
    });
    it("it should handle logical operation for greater than", () => {
        expr = visitor.visitLambda(() => 5 > 2);
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.Greater, "Expected a binary operation of greather than");
    });
    it("it should handle logical operation for greater or equal than", () => {
        expr = visitor.visitLambda(() => 5 >= 2);
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.GreaterOrEqual, "Expected a binary operation of greater or equal than");
    });
    it("it should handle logical operation for lesser", () => {
        expr = visitor.visitLambda(() => 5 < 2);
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.Lesser, "Expected a binary operation of lesser");
    });
    it("it should handle logical operation for or", () => {
        expr = visitor.visitLambda(() => 5 <= 2);
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.LesserOrEqual, "Expected a binary operation of lesser or equal than");
    });
});
//# sourceMappingURL=expressionvisitor_logical_expression.js.map