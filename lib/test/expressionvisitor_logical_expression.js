"use strict";
var assert = require('assert');
var Expr = require('./../expressions/expressionvisitor');
describe("When using ExpressionVisitor for logical Lambda expression", function () {
    var visitor, expr;
    beforeEach(function () {
        visitor = new Expr.ExpressionVisitor;
    });
    it("it should return a logical operation", function () {
        expr = visitor.visitLambda(function () { return 5 && 2; });
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.left.type == Expr.ExpressionType.Literal, "Expected a literal at left side");
        assert.ok(expr.right.type == Expr.ExpressionType.Literal, "Expected a lteral at right side");
        assert.ok(expr.left.value == 5, "Expected number 5 at left side");
        assert.ok(expr.right.value == 2, "Expected number 5 at right side");
    });
    it("it should handle logical operation for and", function () {
        expr = visitor.visitLambda(function () { return 5 && 2; });
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.And, "Expected a binary operation of and");
    });
    it("it should handle logical operation for or", function () {
        expr = visitor.visitLambda(function () { return 5 || 2; });
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.Or, "Expected a binary operation of or");
    });
    it("it should handle logical operation for equal", function () {
        expr = visitor.visitLambda(function () { return 5 == 2; });
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.Equal, "Expected a binary operation of equal");
    });
    it("it should handle logical operation for not equal", function () {
        expr = visitor.visitLambda(function () { return 5 != 2; });
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.NotEqual, "Expected a binary operation of not equal");
    });
    it("it should handle logical operation for greater than", function () {
        expr = visitor.visitLambda(function () { return 5 > 2; });
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.Greater, "Expected a binary operation of greather than");
    });
    it("it should handle logical operation for greater or equal than", function () {
        expr = visitor.visitLambda(function () { return 5 >= 2; });
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.GreaterOrEqual, "Expected a binary operation of greater or equal than");
    });
    it("it should handle logical operation for lesser", function () {
        expr = visitor.visitLambda(function () { return 5 < 2; });
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.Lesser, "Expected a binary operation of lesser");
    });
    it("it should handle logical operation for or", function () {
        expr = visitor.visitLambda(function () { return 5 <= 2; });
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a LogicalExpression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.LesserOrEqual, "Expected a binary operation of lesser or equal than");
    });
});
//# sourceMappingURL=expressionvisitor_logical_expression.js.map